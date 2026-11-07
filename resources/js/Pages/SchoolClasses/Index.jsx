
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    GraduationCap,
} from "lucide-react";

export default function Index({ schoolClasses, activeClasses, filters }) {
    const { flash } = usePage().props;

    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");

    const applyFilters = (e) => {
        e.preventDefault();

        router.get(
            route("school-classes.index"),
            { search, status },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const deleteClass = (id) => {
        if (window.confirm("Are you sure you want to delete this class?")) {
            router.delete(route("school-classes.destroy", id));
        }
    };

    return (
        <AppLayout>
            <Head title="School Classes" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            School Classes
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your school's academic classes.
                        </p>
                    </div>

                    <Link
                        href={route("school-classes.create")}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        <Plus size={18} />
                        Add New Class
                    </Link>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {flash.error}
                    </div>
                )}

                {/* Summary */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-indigo-100 p-3 text-indigo-600">
                                <GraduationCap size={24} />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Classes
                                </p>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {schoolClasses.total}
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-3 text-green-600">
                                <GraduationCap size={24} />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Active Classes
                                </p>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {schoolClasses.data.filter(
                                        (item) => item.status === "active"
                                    ).length}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-5 rounded-xl border bg-white p-4 shadow-sm">
                    <form
                        onSubmit={applyFilters}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-3 top-3 text-gray-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search class name..."
                                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <button
                            type="submit"
                            className="rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900"
                        >
                            Search
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setStatus("");

                                router.get(route("school-classes.index"));
                            }}
                            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Reset
                        </button>
                    </form>
                </div>

                {/* Classes Table */}
                <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                                <tr>
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Class Name</th>
                                    <th className="px-6 py-4">Sections</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Created At</th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {schoolClasses.data.length > 0 ? (
                                    schoolClasses.data.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 text-gray-500">
                                                {schoolClasses.from + index}
                                            </td>

                                            <td className="px-6 py-4 font-medium text-gray-800">
                                                {item.name}
                                            </td>

                                            <td className="px-6 py-4 text-gray-600">
                                                {item.sections_count}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        item.status === "active"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {item.status === "active"
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(
                                                    item.created_at
                                                ).toLocaleDateString()}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route(
                                                            "school-classes.edit",
                                                            item.id
                                                        )}
                                                        className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={17} />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteClass(item.id)
                                                        }
                                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            No school classes found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {schoolClasses.links.length > 3 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4">
                            <p className="text-sm text-gray-500">
                                Showing {schoolClasses.from || 0} to{" "}
                                {schoolClasses.to || 0} of{" "}
                                {schoolClasses.total} classes
                            </p>

                            <div className="flex flex-wrap gap-1">
                                {schoolClasses.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        preserveScroll
                                        onClick={(e) => {
                                            if (!link.url) {
                                                e.preventDefault();
                                            }
                                        }}
                                        className={`rounded-md border px-3 py-2 text-sm ${
                                            link.active
                                                ? "border-indigo-600 bg-indigo-600 text-white"
                                                : link.url
                                                    ? "border-gray-200 text-gray-600 hover:bg-gray-50"
                                                    : "cursor-not-allowed border-gray-100 text-gray-300"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
