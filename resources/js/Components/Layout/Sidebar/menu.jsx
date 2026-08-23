import {
    LayoutDashboard,
    GraduationCap,
    Users,
    BookOpen,
    CalendarDays,
    Receipt,
    ClipboardList,
    Settings,
} from "lucide-react";

const menu = [

    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        permissions: [],
    },

    {
        title: "Students",
        icon: GraduationCap,

        children: [

            {
                title: "Admission",
                href: "/students/admission",
            },

            {
                title: "Student List",
                icon: GraduationCap,
                href: "/students",
                badge: "125",
                badgeColor: "bg-green-600 text-white",
            },

            {
                title: "Attendance",
                href: "/students/attendance",
                badge: "New",
            },

        ],

        permissions: [],
    },

    {
        title: "Teachers",
        icon: Users,
        href: "/teachers",
    },

    {
        title: "Academics",
        icon: BookOpen,

        children: [

            {
                title: "Classes",
                href: "/classes",
            },

            {
                title: "Sections",
                href: "/sections",
            },

            {
                title: "Subjects",
                href: "/subjects",
            },

        ],

    },

    {
        title: "Examinations",
        icon: ClipboardList,
        href: "/examinations",
    },

    {
        title: "Fees",
        icon: Receipt,
        href: "/fees",
    },

    {
        title: "Calendar",
        icon: CalendarDays,
        href: "/calendar",
    },

    {
        title: "Settings",
        icon: Settings,
        href: "/profile",
    },

];

export default menu;