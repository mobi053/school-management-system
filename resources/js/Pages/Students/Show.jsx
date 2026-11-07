import { Head, Link } from "@inertiajs/react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { Download } from "lucide-react";

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



function StudentIDCard({ student }) {
    const cardStyle =
        "relative flex h-[85.6mm] w-[54mm] flex-col overflow-hidden border border-slate-300 bg-white text-slate-800";


    const downloadPDF = async () => {
        const front = document.getElementById("student-id-card-front");
        const back = document.getElementById("student-id-card-back");

        if (!front || !back) {
            alert("Student ID card sides could not be found.");
            return;
        }

        try {
            await document.fonts.ready;

            // Wait for all card images to finish loading.
            const images = [
                ...front.querySelectorAll("img"),
                ...back.querySelectorAll("img"),
            ];

            await Promise.all(
                images.map((img) => {
                    if (img.complete) return Promise.resolve();

                    return new Promise((resolve) => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                })
            );

            // html-to-image uses the browser's SVG renderer instead of
            // html2canvas's CSS color parser, avoiding the unsupported
            // oklch() color error.
            const captureCard = async (element) => {
                return await toPng(element, {
                    pixelRatio: 4,
                    backgroundColor: "#ffffff",
                    cacheBust: true,
                    width: element.offsetWidth,
                    height: element.offsetHeight,
                });
            };

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: [54, 85.6],
                compress: true,
            });

            // FRONT SIDE
            const frontImage = await captureCard(front);
            pdf.addImage(frontImage, "PNG", 0, 0, 54, 85.6);

            // BACK SIDE
            pdf.addPage([54, 85.6], "portrait");

            const backImage = await captureCard(back);
            pdf.addImage(backImage, "PNG", 0, 0, 54, 85.6);

            pdf.save(`Student-ID-${student.admission_no || "Card"}.pdf`);
        } catch (error) {
            console.error("PDF generation error:", error);
            alert(
                "Unable to generate PDF. Please check the browser console for details."
            );
        }
    };


    return (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-5">
                <h3 className="text-lg font-semibold">
                    Student Identity Card
                </h3>
                <p className="text-sm text-muted-foreground">
                    Portrait CR80 · 54 × 85.6 mm · Front and Back
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8">

                {/* ================= FRONT SIDE ================= */}
                <div className="space-y-2">
                    <p className="text-center text-sm font-semibold">
                        Front Side
                    </p>

                    <div
                        id="student-id-card-front"
                        className={`${cardStyle} items-center`}
                    >
                        {/* School Header */}
                        <div className="w-full bg-blue-900 px-2 py-4 text-center text-white">
                            <h2 className="text-sm font-bold uppercase tracking-wide">
                                School Name
                            </h2>

                        </div>

                        {/* Student Photo */}
                        <div className="mt-5 flex h-[35mm] w-[29mm] shrink-0 items-center justify-center overflow-hidden rounded-md border-2 border-blue-900 bg-slate-100">
                            {student.photo ? (
                                <img
                                    src={`/storage/${student.photo}`}
                                    alt={`${student.first_name} ${student.last_name}`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-4xl font-bold text-slate-400">
                                    {student.first_name?.charAt(0)}
                                </span>
                            )}
                        </div>

                        {/* Student Name */}
                        <div className="mt-4 w-full px-2 text-center">
                            <h3 className="text-sm font-bold uppercase leading-tight text-blue-950">
                                {student.first_name} {student.last_name}
                            </h3>

                        </div>

                    </div>
                </div>

                {/* ================= BACK SIDE ================= */}
            
                <div className="space-y-2">
                    <p className="text-center text-sm font-semibold">
                        Back Side
                    </p>

                    <div
                        id="student-id-card-back"
                        className="relative flex h-[85.6mm] w-[54mm] flex-col overflow-hidden border border-slate-300 bg-white text-slate-800"
                    >
                        {/* Header */}
                        <div className="shrink-0 bg-blue-900 px-2 py-3 text-center text-white">
                            <h2 className="text-xs font-bold tracking-wider">
                                STUDENT DETAILS
                            </h2>
                        </div>

                        {/* Student Information */}
                        <div className="flex-1 px-3 py-2 text-[8px] leading-tight">

                            <div className="mb-2">
                                <p className="text-[7px] text-slate-500">Student Name</p>
                                <p className="font-bold uppercase">
                                    {student.first_name} {student.last_name}
                                </p>
                            </div>

                            <div className="mb-2">
                                <p className="text-[7px] text-slate-500">Admission Number</p>
                                <p className="font-semibold">{student.admission_no || "—"}</p>
                            </div>

                            <div className="mb-2 grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-[7px] text-slate-500">Class</p>
                                    <p className="font-semibold">
                                        {student.school_class?.name || "—"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[7px] text-slate-500">Section</p>
                                    <p className="font-semibold">
                                        {student.section?.name || "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-2">
                                <p className="text-[7px] text-slate-500">Date of Birth</p>
                                <p className="font-semibold">{student.date_of_birth || "—"}</p>
                            </div>

                            <div className="mb-2">
                                <p className="text-[7px] text-slate-500">Gender</p>
                                <p className="font-semibold capitalize">{student.gender || "—"}</p>
                            </div>

                            <div className="mb-2">
                                <p className="text-[7px] text-slate-500">Father's Name</p>
                                <p className="font-semibold">{student.father_name || "—"}</p>
                            </div>

                            <div className="mb-2">
                                <p className="text-[7px] text-slate-500">Guardian Contact</p>
                                <p className="font-semibold">
                                    {student.guardian_phone || student.phone || "—"}
                                </p>
                            </div>

                            <div className="mb-2">
                                <p className="text-[7px] text-slate-500">Admission Date</p>
                                <p className="font-semibold">{student.admission_date || "—"}</p>
                            </div>

                            <div>
                                <p className="text-[7px] text-slate-500">Address</p>
                                <p className="font-semibold break-words">
                                    {student.address || "—"}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="shrink-0 bg-blue-900 px-2 py-2 text-center text-[7px] text-white">
                            If found, please return to school.
                        </div>
                    </div>
                </div>

            </div>
            <div className="mt-6 flex justify-center">
            <button
                type="button"
                onClick={downloadPDF}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
                <Download size={18} />
                Download PDF
            </button>
        </div>
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
                    {student.photo ? (
                       <img
                            src={`/storage/${student.photo}`}
                            alt={student.first_name}
                            className="h-28 w-28 rounded-xl border object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
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

                {/* Student ID Card */}
                <StudentIDCard student={student} />

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