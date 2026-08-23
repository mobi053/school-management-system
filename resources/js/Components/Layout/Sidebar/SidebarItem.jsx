import { Link, usePage } from "@inertiajs/react";
import { useSidebar } from "./SidebarContext";

export default function SidebarItem({ item }) {

    const { url } = usePage();

    const { collapsed } = useSidebar();

    const Icon = item.icon;

    const isActive = item.href
        ? url === item.href || url.startsWith(item.href + "/")
        : false;

    return (

        <Link
            href={item.href}
            title={collapsed ? item.title : ""}
            className={`

                group

                mx-2

                my-1

                flex

                items-center

                rounded-lg

                px-4

                py-3

                transition-all

                duration-200

                ${isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"}

            `}
        >

            {/* Icon */}

            <div className="flex h-6 w-6 items-center justify-center">

                {Icon && <Icon size={20} />}

            </div>

            {/* Title */}

            {!collapsed && (

                <span className="ml-3 flex-1">

                    {item.title}

                </span>

            )}

            {/* Badge */}

            {!collapsed && item.badge && (

                <span
                    className={`

                        rounded-full

                        px-2

                        py-0.5

                        text-xs

                        font-semibold

                        ${item.badgeColor
                            ? item.badgeColor
                            : "bg-red-500 text-white"}

                    `}
                >
                    {item.badge}
                </span>
            )}
        </Link>
    );
}