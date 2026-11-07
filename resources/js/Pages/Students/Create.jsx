import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import StudentForm from "./Components/StudentForm";
import AppLayout from "@/Layouts/AppLayout";

export default function Create({ classes, sections, nextAdmissionNo }) {
    return (
        <AppLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold">
                        Student Admission
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Register a new student.
                    </p>
                </div>
            }
        >
            <Head title="Student Admission" />

            <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
                <StudentForm
                    classes={classes}
                    sections={sections}
                    nextAdmissionNo={nextAdmissionNo}
                />
            </div>
        </AppLayout>
    );
}