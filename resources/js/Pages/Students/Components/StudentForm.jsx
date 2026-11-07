import { useEffect, useState } from "react";
import { Link, useForm } from "@inertiajs/react";

const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

const labelClass = "mb-1.5 block text-sm font-medium";

function Field({
    label,
    name,
    value,
    onChange,
    error,
    type = "text",
    required = false,
    placeholder = "",
    ...props
}) {
    return (
        <div>
            <label htmlFor={name} className={labelClass}>
                {label}
                {required && <span className="text-red-500"> *</span>}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value ?? ""}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClass}
                required={required}
                {...props}
            />

            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

function SelectField({
    label,
    name,
    value,
    onChange,
    options,
    error,
    placeholder = "Select option",
    required = false,
    disabled = false,
}) {
    return (
        <div>
            <label htmlFor={name} className={labelClass}>
                {label}
                {required && <span className="text-red-500"> *</span>}
            </label>

            <select
                id={name}
                name={name}
                value={value ?? ""}
                onChange={onChange}
                className={inputClass}
                required={required}
                disabled={disabled}
            >
                <option value="">{placeholder}</option>

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

function SectionHeading({ title, description }) {
    return (
        <div className="mb-5 border-b pb-3">
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && (
                <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    );
}

export default function StudentForm({
    student = null,
    classes = [],
    sections = [],
    photoUrl = null,
    nextAdmissionNo = "",
}) {
    const isEdit = Boolean(student);

    const { data, setData, post, transform, processing, errors } = useForm({
        admission_no: student?.admission_no ?? nextAdmissionNo,
        admission_date:
            student?.admission_date?.substring(0, 10) ??
            new Date().toLocaleDateString("en-CA"),

        first_name: student?.first_name ?? "",
        last_name: student?.last_name ?? "",
        father_name: student?.father_name ?? "",
        gender: student?.gender ?? "",
        date_of_birth: student?.date_of_birth?.substring(0, 10) ?? "",
        blood_group: student?.blood_group ?? "",

        class_id: student?.class_id?.toString() ?? "",
        section_id: student?.section_id?.toString() ?? "",

        phone: student?.phone ?? "",
        email: student?.email ?? "",
        address: student?.address ?? "",

        guardian_name: student?.guardian_name ?? "",
        guardian_relation: student?.guardian_relation ?? "Father",
        guardian_phone: student?.guardian_phone ?? "",
        guardian_cnic: student?.guardian_cnic ?? "",
        guardian_occupation: student?.guardian_occupation ?? "",
        guardian_email: student?.guardian_email ?? "",
        guardian_address: student?.guardian_address ?? "",

        photo: null,
        remove_photo: false,
        status: student?.status ?? "active",
    });

    const [preview, setPreview] = useState(photoUrl);

    useEffect(() => {
        return () => {
            if (preview?.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const updateField = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handlePhoto = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setData("photo", file);
        setData("remove_photo", false);
        setPreview(URL.createObjectURL(file));
    };

    const filteredSections = sections.filter(
        (section) => String(section.class_id) === String(data.class_id)
    );

    const handleClassChange = (e) => {
        setData((previous) => ({
            ...previous,
            class_id: e.target.value,
            section_id: "",
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit) {
            transform((formData) => ({
                ...formData,
                _method: "put",
            }));

            post(route("students.update", student.id), {
                forceFormData: true,
                preserveScroll: true,
            });
        } else {
            post(route("students.store"), {
                forceFormData: true,
                preserveScroll: true,
            });
        }
    };

    const removePhoto = () => {
        setData("photo", null);
        setData("remove_photo", true);
        setPreview(null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Admission Information */}
            <div className="rounded-xl border bg-card p-5 shadow-sm">
                <SectionHeading
                    title="Admission Information"
                    description="Student admission and academic assignment details."
                />

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                    <Field
                        label="Admission Number"
                        name="admission_no"
                        value={data.admission_no}
                        onChange={updateField}
                        error={errors.admission_no}
                        placeholder="Auto generated"
                    />

                    <Field
                        label="Admission Date"
                        name="admission_date"
                        type="date"
                        value={data.admission_date}
                        onChange={updateField}
                        error={errors.admission_date}
                        required
                    />

                    <SelectField
                        label="Class"
                        name="class_id"
                        value={data.class_id}
                        onChange={handleClassChange}
                        error={errors.class_id}
                        required
                        options={classes.map((item) => ({
                            value: String(item.id),
                            label: item.name,
                        }))}
                    />

                    <SelectField
                        label="Section"
                        name="section_id"
                        value={data.section_id}
                        onChange={updateField}
                        error={errors.section_id}
                        required
                        disabled={!data.class_id}
                        options={filteredSections.map((item) => ({
                            value: String(item.id),
                            label: item.name,
                        }))}
                    />

                    <SelectField
                        label="Student Status"
                        name="status"
                        value={data.status}
                        onChange={updateField}
                        error={errors.status}
                        required
                        options={[
                            { value: "active", label: "Active" },
                            { value: "inactive", label: "Inactive" },
                            { value: "graduated", label: "Graduated" },
                            { value: "transferred", label: "Transferred" },
                        ]}
                    />
                </div>
            </div>

            {/* Personal Information */}
            <div className="rounded-xl border bg-card p-5 shadow-sm">
                <SectionHeading
                    title="Personal Information"
                    description="Basic information and photograph of the student."
                />

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                    <Field
                        label="First Name"
                        name="first_name"
                        value={data.first_name}
                        onChange={updateField}
                        error={errors.first_name}
                        required
                    />

                    <Field
                        label="Last Name"
                        name="last_name"
                        value={data.last_name}
                        onChange={updateField}
                        error={errors.last_name}
                    />

                    <Field
                        label="Father Name"
                        name="father_name"
                        value={data.father_name}
                        onChange={updateField}
                        error={errors.father_name}
                    />

                    <SelectField
                        label="Gender"
                        name="gender"
                        value={data.gender}
                        onChange={updateField}
                        error={errors.gender}
                        required
                        options={[
                            { value: "male", label: "Male" },
                            { value: "female", label: "Female" },
                            { value: "other", label: "Other" },
                        ]}
                    />

                    <Field
                        label="Date of Birth"
                        name="date_of_birth"
                        type="date"
                        value={data.date_of_birth}
                        onChange={updateField}
                        error={errors.date_of_birth}
                    />

                    <SelectField
                        label="Blood Group"
                        name="blood_group"
                        value={data.blood_group}
                        onChange={updateField}
                        error={errors.blood_group}
                        options={[
                            ...["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
                                .map((group) => ({
                                    value: group,
                                    label: group,
                                })),
                        ]}
                    />

                    <Field
                        label="Phone"
                        name="phone"
                        value={data.phone}
                        onChange={updateField}
                        error={errors.phone}
                    />

                    <Field
                        label="Email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={updateField}
                        error={errors.email}
                    />

                    <div className="md:col-span-2 lg:col-span-3">
                        <label className={labelClass}>Residential Address</label>
                        <textarea
                            name="address"
                            value={data.address}
                            onChange={updateField}
                            rows={3}
                            className={inputClass}
                        />
                        {errors.address && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.address}
                            </p>
                        )}
                    </div>
                </div>

                {/* Student Photograph */}
                <div className="mt-6 border-t pt-5">
                    <label className={labelClass}>Student Photograph</label>

                    <div className="flex flex-wrap items-center gap-5">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Student preview"
                                className="h-28 w-28 rounded-lg border object-cover"
                            />
                        ) : (
                            <div className="flex h-28 w-28 items-center justify-center rounded-lg border bg-muted text-xs text-muted-foreground">
                                No Photo
                            </div>
                        )}

                        <div>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handlePhoto}
                                className="block w-full text-sm"
                            />

                            <p className="mt-2 text-xs text-muted-foreground">
                                JPG, JPEG, PNG or WEBP. Maximum size: 2 MB.
                            </p>

                            {preview && (
                                <button
                                    type="button"
                                    onClick={removePhoto}
                                    className="mt-2 text-sm text-red-500 hover:underline"
                                >
                                    Remove photograph
                                </button>
                            )}

                            {errors.photo && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.photo}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Guardian Information */}
            <div className="rounded-xl border bg-card p-5 shadow-sm">
                <SectionHeading
                    title="Guardian Information"
                    description="Parent or legal guardian contact information."
                />

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                    <Field
                        label="Guardian Name"
                        name="guardian_name"
                        value={data.guardian_name}
                        onChange={updateField}
                        error={errors.guardian_name}
                        required
                    />

                    <SelectField
                        label="Relationship"
                        name="guardian_relation"
                        value={data.guardian_relation}
                        onChange={updateField}
                        error={errors.guardian_relation}
                        required
                        options={[
                            { value: "Father", label: "Father" },
                            { value: "Mother", label: "Mother" },
                            { value: "Brother", label: "Brother" },
                            { value: "Sister", label: "Sister" },
                            { value: "Uncle", label: "Uncle" },
                            { value: "Grandfather", label: "Grandfather" },
                            { value: "Other", label: "Other" },
                        ]}
                    />

                    <Field
                        label="Guardian Phone"
                        name="guardian_phone"
                        value={data.guardian_phone}
                        onChange={updateField}
                        error={errors.guardian_phone}
                        required
                    />

                    <Field
                        label="Guardian CNIC"
                        name="guardian_cnic"
                        value={data.guardian_cnic}
                        onChange={updateField}
                        error={errors.guardian_cnic}
                        placeholder="XXXXX-XXXXXXX-X"
                    />

                    <Field
                        label="Occupation"
                        name="guardian_occupation"
                        value={data.guardian_occupation}
                        onChange={updateField}
                        error={errors.guardian_occupation}
                    />

                    <Field
                        label="Guardian Email"
                        name="guardian_email"
                        type="email"
                        value={data.guardian_email}
                        onChange={updateField}
                        error={errors.guardian_email}
                    />

                    <div className="md:col-span-2 lg:col-span-3">
                        <label className={labelClass}>Guardian Address</label>
                        <textarea
                            name="guardian_address"
                            value={data.guardian_address}
                            onChange={updateField}
                            rows={3}
                            className={inputClass}
                        />
                        {errors.guardian_address && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.guardian_address}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-end gap-3">
                <Link
                    href={route("students.index")}
                    className="rounded-md border px-5 py-2 text-sm font-medium hover:bg-muted"
                >
                    Cancel
                </Link>

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                    {processing
                        ? "Saving..."
                        : isEdit
                            ? "Update Student"
                            : "Save Admission"}
                </button>
            </div>
        </form>
    );
}