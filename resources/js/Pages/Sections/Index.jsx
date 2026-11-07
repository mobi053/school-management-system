import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

import AppLayout from "@/Layouts/AppLayout";

export default function Index({ sections, filters }) {
    const { flash } = usePage().props;

    const handleSearch = (value) => {
        router.get(
            route("sections.index"),
            {
                search: value,
                status: filters?.status || "",
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleStatus = (value) => {
        router.get(
            route("sections.index"),
            {
                search: filters?.search || "",
                status: value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this section?")) {
            router.delete(route("sections.destroy", id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Sections" />

            <div className="space-y-6 p-6">

                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Sections
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage class sections.
                        </p>
                    </div>

                    <Link
                        href={route("sections.create")}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        <Plus size={18} />
                        Add Section
                    </Link>
                </div>

                {/* Flash Message */}
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                {/* Main Card */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

                    <div className="flex flex-col justify-between gap-4 border-b p-5 sm:flex-row sm:items-center">
                        <h2 className="font-semibold text-gray-800">
                            Section List
                        </h2>

                        <div className="flex flex-col gap-3 sm:flex-row">

                            {/* Search */}
                            <div className="relative">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    defaultValue={filters?.search || ""}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                    placeholder="Search section or class..."
                                    className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:w-64"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={filters?.status || "all"}
                                onChange={(e) =>
                                    handleStatus(e.target.value)
                                }
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                                <tr>
                                    <th className="px-5 py-4">#</th>
                                    <th className="px-5 py-4">Section</th>
                                    <th className="px-5 py-4">Class</th>
                                    <th className="px-5 py-4">Capacity</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {sections.data.length > 0 ? (
                                    sections.data.map((section, index) => (
                                        <tr
                                            key={section.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4 text-gray-500">
                                                {sections.from + index}
                                            </td>

                                            <td className="px-5 py-4 font-medium text-gray-800">
                                                {section.name}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {section.school_class?.name || "-"}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {section.capacity}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        section.status === "active"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {section.status === "active"
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">

                                                    <Link
                                                        href={route(
                                                            "sections.edit",
                                                            section.id
                                                        )}
                                                        className="rounded-md border border-blue-200 p-2 text-blue-600 hover:bg-blue-50"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(section.id)
                                                        }
                                                        className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-5 py-12 text-center text-gray-500"
                                        >
                                            No sections found.
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col justify-between gap-3 border-t px-5 py-4 sm:flex-row sm:items-center">
                        <p className="text-sm text-gray-500">
                            Showing {sections.from || 0} to{" "}
                            {sections.to || 0} of {sections.total} sections
                        </p>

                        <div className="flex flex-wrap gap-1">
                            {sections.links.map((link, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url && router.visit(link.url, {
                                            preserveState: true,
                                            preserveScroll: true,
                                        })
                                    }
                                    className={`rounded-md border px-3 py-1.5 text-sm ${
                                        link.active
                                            ? "border-indigo-600 bg-indigo-600 text-white"
                                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                    } ${
                                        !link.url
                                            ? "cursor-not-allowed opacity-40"
                                            : ""
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}