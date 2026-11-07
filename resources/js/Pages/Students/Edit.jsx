import { Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import StudentForm from "./Components/StudentForm";

export default function Edit({
    student,
    classes,
    sections,
    photoUrl,
}) {
    return (
        <AppLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold">
                        Edit Student
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Update student admission information.
                    </p>
                </div>
            }
        >
            <Head title="Edit Student" />

            <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
                <StudentForm
                    student={student}
                    classes={classes}
                    sections={sections}
                    photoUrl={photoUrl}
                />
            </div>
        </AppLayout>
    );
}