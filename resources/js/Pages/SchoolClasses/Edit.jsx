
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import SchoolClassForm from "./Components/SchoolClassForm";
import { ArrowLeft } from "lucide-react";

export default function Edit({ schoolClass }) {
    return (
        <AppLayout>
            <Head title="Edit School Class" />

            <div className="p-6">
                <div className="mb-6 flex items-center gap-3">
                    <Link
                        href={route("school-classes.index")}
                        className="rounded-lg p-2 hover:bg-gray-200"
                    >
                        <ArrowLeft size={20} />
                    </Link>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Edit School Class
                        </h1>
                        <p className="text-sm text-gray-500">
                            Update the details of {schoolClass.name}.
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
                    <SchoolClassForm schoolClass={schoolClass} />
                </div>
            </div>
        </AppLayout>
    );
}
