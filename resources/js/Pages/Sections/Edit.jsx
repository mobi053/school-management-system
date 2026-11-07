import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";

import AppLayout from "@/Layouts/AppLayout";

export default function Edit({ section, classes }) {
    const { data, setData, put, processing, errors } = useForm({
        class_id: String(section.class_id),
        name: section.name || "",
        capacity: section.capacity || 40,
        status: section.status || "active",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("sections.update", section.id));
    };

    return (
        <AppLayout>
            <Head title="Edit Section" />

            <div className="space-y-6 p-6">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href={route("sections.index")}
                        className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50"
                    >
                        <ArrowLeft size={19} />
                    </Link>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Edit Section
                        </h1>

                        <p className="text-sm text-gray-500">
                            Update section information.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-3xl rounded-xl border bg-white p-6 shadow-sm">

                    <h2 className="mb-6 border-b pb-4 font-semibold text-gray-800">
                        Section Information
                    </h2>

                    <form onSubmit={submit} className="space-y-5">

                        {/* Class */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Class <span className="text-red-500">*</span>
                            </label>

                            <select
                                value={data.class_id}
                                onChange={(e) =>
                                    setData("class_id", e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                            >
                                <option value="">Select Class</option>

                                {classes.map((schoolClass) => (
                                    <option
                                        key={schoolClass.id}
                                        value={schoolClass.id}
                                    >
                                        {schoolClass.name}
                                    </option>
                                ))}
                            </select>

                            {errors.class_id && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.class_id}
                                </p>
                            )}
                        </div>

                        {/* Section Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Section Name <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                maxLength={100}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Capacity */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Student Capacity <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="number"
                                min="1"
                                max="1000"
                                value={data.capacity}
                                onChange={(e) =>
                                    setData("capacity", e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                            />

                            {errors.capacity && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.capacity}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Status
                            </label>

                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 border-t pt-5">
                            <Link
                                href={route("sections.index")}
                                className="rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                <Save size={17} />

                                {processing ? "Updating..." : "Update Section"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}