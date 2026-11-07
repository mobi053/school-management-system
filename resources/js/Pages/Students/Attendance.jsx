import { useMemo, useState } from "react";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

const inputClass =
    "rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

const statusStyles = {
    present: "text-green-700 bg-green-100",
    absent: "text-red-700 bg-red-100",
    leave: "text-yellow-700 bg-yellow-100",
    late: "text-blue-700 bg-blue-100",
};

export default function Attendance({
    students,
    classes,
    sections,
    filters,
}) {
    const { flash } = usePage().props;

    const [date, setDate] = useState(filters.date);
    const [classId, setClassId] = useState(filters.class_id ?? "");
    const [sectionId, setSectionId] = useState(filters.section_id ?? "");

    const filteredSections = sections.filter(
        (section) => String(section.class_id) === String(classId)
    );

    const { data, setData, post, processing } = useForm({
        date: filters.date,
        class_id: filters.class_id ?? "",
        section_id: filters.section_id ?? "",
        attendance: students.map((student) => ({
            student_id: student.id,
            status: student.status ?? "",
            remarks: student.remarks ?? "",
        })),
    });

    const counts = useMemo(() => {
        const result = {
            present: 0,
            absent: 0,
            leave: 0,
            late: 0,
        };

        data.attendance.forEach((item) => {
            if (result[item.status] !== undefined) {
                result[item.status]++;
            }
        });

        return result;
    }, [data.attendance]);

    const applyFilters = (e) => {
        e.preventDefault();

        router.get(
            route("students.attendance"),
            {
                date,
                class_id: classId,
                section_id: sectionId,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const updateAttendance = (index, field, value) => {
        const updated = [...data.attendance];

        updated[index] = {
            ...updated[index],
            [field]: value,
        };

        setData("attendance", updated);
    };

    const markAll = (status) => {
        setData(
            "attendance",
            data.attendance.map((item) => ({
                ...item,
                status,
            }))
        );
    };

    const saveAttendance = (e) => {
        e.preventDefault();

        if (!classId || !sectionId) {
            alert("Please select a class and section.");
            return;
        }

        post(route("students.attendance.store"), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold">
                        Student Attendance
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Manage daily student attendance.
                    </p>
                </div>
            }
        >
            <Head title="Student Attendance" />

            <div className="space-y-5 p-4 sm:p-6">

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                {/* Filters */}
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <form
                        onSubmit={applyFilters}
                        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
                    >
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">
                                Attendance Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={inputClass + " w-full"}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium">
                                Class
                            </label>
                            <select
                                value={classId}
                                onChange={(e) => {
                                    setClassId(e.target.value);
                                    setSectionId("");
                                }}
                                className={inputClass + " w-full"}
                                required
                            >
                                <option value="">Select Class</option>
                                {classes.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium">
                                Section
                            </label>
                            <select
                                value={sectionId}
                                onChange={(e) => setSectionId(e.target.value)}
                                className={inputClass + " w-full"}
                                disabled={!classId}
                                required
                            >
                                <option value="">Select Section</option>
                                {filteredSections.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                            >
                                Load Students
                            </button>
                        </div>
                    </form>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                        ["Present", counts.present, "text-green-600"],
                        ["Absent", counts.absent, "text-red-600"],
                        ["Leave", counts.leave, "text-yellow-600"],
                        ["Late", counts.late, "text-blue-600"],
                    ].map(([label, count, color]) => (
                        <div
                            key={label}
                            className="rounded-xl border bg-card p-4 shadow-sm"
                        >
                            <p className="text-sm text-muted-foreground">
                                {label}
                            </p>
                            <p className={`mt-1 text-2xl font-bold ${color}`}>
                                {count}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Attendance Form */}
                <form onSubmit={saveAttendance}>
                    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">

                        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
                            <div>
                                <h3 className="font-semibold">
                                    Attendance Register
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Date: {date} | Students: {students.length}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {["present", "absent", "leave", "late"].map(
                                    (status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => markAll(status)}
                                            className={`rounded-md px-3 py-2 text-xs font-medium capitalize ${statusStyles[status]}`}
                                        >
                                            All {status}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3">#</th>
                                        <th className="px-4 py-3">Admission No.</th>
                                        <th className="px-4 py-3">Student Name</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Remarks</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {students.length > 0 ? (
                                        students.map((student, index) => (
                                            <tr key={student.id}>
                                                <td className="px-4 py-3">
                                                    {index + 1}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {student.admission_no}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <div className="font-medium">
                                                        {student.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {student.class} / {student.section}
                                                    </div>
                                                </td>

                                                <td className="min-w-36 px-4 py-3">
                                                    <select
                                                        value={data.attendance[index]?.status ?? ""}
                                                        onChange={(e) =>
                                                            updateAttendance(
                                                                index,
                                                                "status",
                                                                e.target.value
                                                            )
                                                        }
                                                        className={inputClass + " w-full"}
                                                        required
                                                    >
                                                        <option value="">
                                                            Select Status
                                                        </option>
                                                        <option value="present">
                                                            Present
                                                        </option>
                                                        <option value="absent">
                                                            Absent
                                                        </option>
                                                        <option value="leave">
                                                            Leave
                                                        </option>
                                                        <option value="late">
                                                            Late
                                                        </option>
                                                    </select>
                                                </td>

                                                <td className="min-w-48 px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={data.attendance[index]?.remarks ?? ""}
                                                        onChange={(e) =>
                                                            updateAttendance(
                                                                index,
                                                                "remarks",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Optional remarks"
                                                        className={inputClass + " w-full"}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-4 py-12 text-center text-muted-foreground"
                                            >
                                                No active students found. Select a class and section.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-wrap justify-between gap-3 border-t p-4">
                            <Link
                                href={route("students.index")}
                                className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
                            >
                                Back to Students
                            </Link>

                            <button
                                type="submit"
                                disabled={
                                    processing ||
                                    students.length === 0 ||
                                    !classId ||
                                    !sectionId
                                }
                                className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                            >
                                {processing ? "Saving..." : "Save Attendance"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}