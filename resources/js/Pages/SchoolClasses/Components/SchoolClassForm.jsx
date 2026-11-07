
import { useForm } from "@inertiajs/react";

export default function SchoolClassForm({ schoolClass = null }) {
    const isEditing = Boolean(schoolClass);

    const { data, setData, post, put, processing, errors } = useForm({
        name: schoolClass?.name || "",
        status: schoolClass?.status || "active",
    });

    const submit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route("school-classes.update", schoolClass.id));
        } else {
            post(route("school-classes.store"));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Class Name <span className="text-red-500">*</span>
                </label>

                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="Enter class name (e.g. Class 1)"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.name}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Status <span className="text-red-500">*</span>
                </label>

                <select
                    value={data.status}
                    onChange={(e) => setData("status", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                {errors.status && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.status}
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-3 border-t pt-5">
                <a
                    href={route("school-classes.index")}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </a>

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {processing
                        ? "Saving..."
                        : isEditing
                            ? "Update Class"
                            : "Save Class"}
                </button>
            </div>
        </form>
    );
}
