import { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { createPortal } from "react-dom";

import AppLayout from "@/Layouts/AppLayout";

const inputClass =
    "rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

const statusColors = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-700",
    graduated: "bg-blue-100 text-blue-700",
    transferred: "bg-orange-100 text-orange-700",
};

export default function Index({
    students,
    classes,
    sections,
    filters,
}) {
    const { flash } = usePage().props;
    const [openActionId, setOpenActionId] = useState(null);
    const [eventPosition, setEventPosition] = useState(null);
    
    const [search, setSearch] = useState(filters.search ?? "");
    const [classId, setClassId] = useState(filters.class_id ?? "");
    const [sectionId, setSectionId] = useState(filters.section_id ?? "");
    const [status, setStatus] = useState(filters.status ?? "");

    const filteredSections = sections.filter(
        (section) => String(section.class_id) === String(classId)
    );

    const applyFilters = (e) => {
        e.preventDefault();

        router.get(
            route("students.index"),
            {
                search,
                class_id: classId,
                section_id: sectionId,
                status,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const deleteStudent = (student) => {
        if (
            window.confirm(
                `Are you sure you want to delete ${student.first_name}?`
            )
        ) {
            router.delete(route("students.destroy", student.id));
        }
    };
    const toggleActionMenu = (e, studentId) => {
        if (openActionId === studentId) {
            setOpenActionId(null);
            setEventPosition(null);
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();

        const menuWidth = 144;
        const menuHeight = 116;
        const spacing = 6;

        // Keep dropdown inside the viewport horizontally
        const left = Math.max(
            8,
            Math.min(
                rect.right - menuWidth,
                window.innerWidth - menuWidth - 8
            )
        );

        // Open upward if there isn't enough room below
        const spaceBelow = window.innerHeight - rect.bottom;

        const top =
            spaceBelow >= menuHeight + spacing
                ? rect.bottom + spacing
                : Math.max(8, rect.top - menuHeight - spacing);

        setEventPosition({ top, left });
        setOpenActionId(studentId);
    };

    return (
        <AppLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold">
                            Students
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Manage student records and admissions.
                        </p>
                    </div>

                    <Link
                        href={route("students.admissions")}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                        + New Admission
                    </Link>
                </div>
            }
        >
            <Head title="Students" />

            <div className="space-y-5 p-4 sm:p-6">

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                {/* Filters */}
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <form
                        onSubmit={applyFilters}
                        className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5"
                    >
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search students..."
                            className={inputClass}
                        />

                        <select
                            value={classId}
                            onChange={(e) => {
                                setClassId(e.target.value);
                                setSectionId("");
                            }}
                            className={inputClass}
                        >
                            <option value="">All Classes</option>
                            {classes.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={sectionId}
                            onChange={(e) => setSectionId(e.target.value)}
                            className={inputClass}
                            disabled={!classId}
                        >
                            <option value="">All Sections</option>
                            {filteredSections.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className={inputClass}
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="graduated">Graduated</option>
                            <option value="transferred">Transferred</option>
                        </select>

                        <button
                            type="submit"
                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                        >
                            Apply Filters
                        </button>
                    </form>
                </div>

                {/* Students table */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b p-4">
                        <h3 className="font-semibold">Student Records</h3>
                        <span className="text-sm text-muted-foreground">
                            Total: {students.total}
                        </span>
                    </div>

                    <div className="overflow-x-auto overflow-y-visible">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3">Student</th>
                                    <th className="px-4 py-3">Admission No.</th>
                                    <th className="px-4 py-3">Class</th>
                                    <th className="px-4 py-3">Section</th>
                                    <th className="px-4 py-3">Guardian Phone</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {students.data.length > 0 ? (
                                    students.data.map((student) => (
                                        <tr
                                            key={student.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {student.photo ? (
                                                        <img
                                                            src={`/storage/${student.photo}`}
                                                            alt={student.first_name}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-semibold">
                                                            {student.first_name?.charAt(0)}
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="font-medium">
                                                            {student.first_name}{" "}
                                                            {student.last_name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {student.father_name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                {student.admission_no}
                                            </td>

                                            <td className="px-4 py-3">
                                                {student.school_class?.name}
                                            </td>

                                            <td className="px-4 py-3">
                                                {student.section?.name}
                                            </td>

                                            <td className="px-4 py-3">
                                                {student.guardian_phone}
                                            </td>

                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                        statusColors[student.status]
                                                    }`}
                                                >
                                                    {student.status}
                                                </span>
                                            </td>

                                            <td className="w-12 px-3 py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={(e) => toggleActionMenu(e, student.id)}
                                                    className="inline-flex h-8 w-8 items-center justify-center
                                                            rounded-md text-gray-500
                                                            hover:bg-gray-100 hover:text-gray-900"
                                                    title="Actions"
                                                >
                                                    <MoreVertical size={20} />
                                                </button>

                                                {openActionId === student.id &&
                                                    eventPosition &&
                                                    createPortal(
                                                        <>
                                                            {/* Invisible backdrop to close menu */}
                                                            <div
                                                                className="fixed inset-0 z-[99998]"
                                                                onClick={() => {
                                                                    setOpenActionId(null);
                                                                    setEventPosition(null);
                                                                }}
                                                            />

                                                            {/* Dropdown */}
                                                            <div
                                                                className="fixed z-[99999] w-36 rounded-md
                                                                        border border-gray-200 bg-white
                                                                        py-1 shadow-xl"
                                                                style={{
                                                                    top: `${eventPosition.top}px`,
                                                                    left: `${eventPosition.left}px`,
                                                                }}
                                                            >
                                                                <Link
                                                                    href={route("students.show", student.id)}
                                                                    onClick={() => {
                                                                        setOpenActionId(null);
                                                                        setEventPosition(null);
                                                                    }}
                                                                    className="flex items-center gap-2 px-3 py-2
                                                                            text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    <Eye size={16} />
                                                                    View
                                                                </Link>

                                                                <Link
                                                                    href={route("students.edit", student.id)}
                                                                    onClick={() => {
                                                                        setOpenActionId(null);
                                                                        setEventPosition(null);
                                                                    }}
                                                                    className="flex items-center gap-2 px-3 py-2
                                                                            text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    <Pencil size={16} />
                                                                    Edit
                                                                </Link>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setOpenActionId(null);
                                                                        setEventPosition(null);
                                                                        deleteStudent(student);
                                                                    }}
                                                                    className="flex w-full items-center gap-2
                                                                            px-3 py-2 text-left text-sm
                                                                            text-red-600 hover:bg-red-50"
                                                                >
                                                                    <Trash2 size={16} />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </>,
                                                        document.body
                                                    )}
                                            </td>    
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-4 py-12 text-center text-muted-foreground"
                                        >
                                            No students found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4">
                        <p className="text-sm text-muted-foreground">
                            Showing {students.from ?? 0} to {students.to ?? 0}
                            {" "}of {students.total} students
                        </p>

                        <div className="flex flex-wrap gap-1">
                            {students.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || "#"}
                                    preserveScroll
                                    className={`rounded-md border px-3 py-1.5 text-sm ${
                                        link.active
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted"
                                    } ${
                                        !link.url
                                            ? "pointer-events-none opacity-40"
                                            : ""
                                    }`}
                                >
                                    {link.label
                                        .replace("&laquo;", "«")
                                        .replace("&raquo;", "»")}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}