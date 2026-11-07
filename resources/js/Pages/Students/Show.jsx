import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

function Info({ label, value }) {
    return (
        <div className="border-b py-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-sm font-medium">{value || "—"}</p>
        </div>
    );
}

function ProfileSection({ title, children }) {
    return (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-4 border-b pb-3 text-lg font-semibold">
                {title}
            </h3>
            {children}
        </div>
    );
}

export default function Show({ student, photoUrl }) {
    return (
        <AppLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold">
                            Student Profile
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {student.admission_no}
                        </p>
                    </div>

                    <Link
                        href={route("students.edit", student.id)}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                        Edit Student
                    </Link>
                </div>
            }
        >
            <Head title="Student Profile" />

            <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">

                {/* Profile Header */}
                <div className="flex flex-wrap items-center gap-5 rounded-xl border bg-card p-6 shadow-sm">
                    {photoUrl ? (
                        <img
                            src={photoUrl}
                            alt={student.first_name}
                            className="h-28 w-28 rounded-xl border object-cover"
                        />
                    ) : (
                        <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-muted text-3xl font-semibold">
                            {student.first_name?.charAt(0)}
                        </div>
                    )}

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">
                            {student.first_name} {student.last_name}
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Admission No: {student.admission_no}
                        </p>

                        <p className="text-sm text-muted-foreground">
                            {student.school_class?.name} / {student.section?.name}
                        </p>

                        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium capitalize text-green-700">
                            {student.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                    <ProfileSection title="Admission Information">
                        <Info label="Admission Number" value={student.admission_no} />
                        <Info label="Admission Date" value={student.admission_date} />
                        <Info label="Class" value={student.school_class?.name} />
                        <Info label="Section" value={student.section?.name} />
                        <Info label="Status" value={student.status} />
                    </ProfileSection>

                    <ProfileSection title="Personal Information">
                        <Info label="First Name" value={student.first_name} />
                        <Info label="Last Name" value={student.last_name} />
                        <Info label="Father Name" value={student.father_name} />
                        <Info label="Gender" value={student.gender} />
                        <Info label="Date of Birth" value={student.date_of_birth} />
                        <Info label="Blood Group" value={student.blood_group} />
                    </ProfileSection>

                    <ProfileSection title="Contact Information">
                        <Info label="Phone" value={student.phone} />
                        <Info label="Email" value={student.email} />
                        <Info label="Address" value={student.address} />
                    </ProfileSection>

                    <ProfileSection title="Guardian Information">
                        <Info label="Guardian Name" value={student.guardian_name} />
                        <Info label="Relationship" value={student.guardian_relation} />
                        <Info label="Guardian Phone" value={student.guardian_phone} />
                        <Info label="Guardian CNIC" value={student.guardian_cnic} />
                        <Info label="Occupation" value={student.guardian_occupation} />
                        <Info label="Guardian Email" value={student.guardian_email} />
                        <Info label="Guardian Address" value={student.guardian_address} />
                    </ProfileSection>
                </div>

                {/* Recent Attendance */}
                <ProfileSection title="Recent Attendance">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Remarks</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {student.attendances?.length ? (
                                    student.attendances.map((record) => (
                                        <tr key={record.id}>
                                            <td className="px-4 py-3">
                                                {record.attendance_date}
                                            </td>
                                            <td className="px-4 py-3 capitalize">
                                                {record.status}
                                            </td>
                                            <td className="px-4 py-3">
                                                {record.remarks || "—"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No attendance records available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </ProfileSection>

                <div>
                    <Link
                        href={route("students.index")}
                        className="text-sm text-primary hover:underline"
                    >
                        ← Back to Students
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}