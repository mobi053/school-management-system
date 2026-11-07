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

    // Students
    {
        title: "Students",
        icon: GraduationCap,

        children: [
            {
                title: "Admission",
                href: "/students/admissions",
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

    // Teachers
    {
        title: "Teachers",
        icon: Users,
        href: "/teachers",
    },

    // Academics
    {
        title: "Academics",
        icon: BookOpen,

        children: [
            {
                title: "Classes",
                href: "/school-classes",
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

    // Examinations
    {
        title: "Examinations",
        icon: ClipboardList,
        href: "/examinations",
    },

    // Fees
    {
        title: "Fees",
        icon: Receipt,
        href: "/fees",
    },

    // Calendar
    {
        title: "Calendar",
        icon: CalendarDays,
        href: "/calendar",
    },

    // Settings
    {
        title: "Settings",
        icon: Settings,
        href: "/profile",
    },

];

export default menu;