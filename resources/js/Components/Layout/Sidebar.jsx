import { Link } from "@inertiajs/react";

const menu = [
    {
        title: "Dashboard",
        href: "/dashboard",
    },
    {
        title: "Students",
        href: "/students",
    },
    {
        title: "Teachers",
        href: "/teachers",
    },
    {
        title: "Classes",
        href: "/classes",
    },
    {
        title: "Subjects",
        href: "/subjects",
    },
    {
        title: "Attendance",
        href: "/attendance",
    },
    {
        title: "Examinations",
        href: "/examinations",
    },
    {
        title: "Fees",
        href: "/fees",
    },
    {
        title: "Reports",
        href: "/reports",
    },
    {
        title: "Settings",
        href: "/settings",
    },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen">
            <div className="h-16 flex items-center justify-center border-b border-slate-700">
                <h2 className="text-xl font-bold">
                    SMS
                </h2>
            </div>
            <nav className="mt-5">
                {
                    menu.map(item => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="block px-6 py-3 hover:bg-slate-800 transition"
                        >
                            {item.title}
                        </Link>
                    ))
                }
            </nav>
        </aside>
    );
}