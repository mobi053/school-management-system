import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";

export default function SidebarDropdown({ item }) {

    const { url } = usePage();

    const hasActiveChild = item.children.some(child => child.href === url);

    const [open, setOpen] = useState(hasActiveChild);

    return (

        <div className="mb-1">

            <button

                onClick={() => setOpen(!open)}

                className={`
                    w-full
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    px-4
                    py-3
                    mx-3

                    ${
                        hasActiveChild
                            ? "bg-slate-800 text-white"
                            : "text-gray-300 hover:bg-slate-800 hover:text-white"
                    }

                `}
            >

                <div className="flex items-center gap-3">

                    {item.icon && <item.icon size={20} />}

                    {item.title}

                </div>

                <ChevronDown
                    size={18}
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                />

            </button>

            {open && (

                <div className="ml-5 mt-1">

                    {item.children.map(child => {

                        const active = child.href === url;

                        return (

                            <Link

                                key={child.title}

                                href={child.href}

                                className={`
                                    flex
                                    items-center
                                    justify-between
                                    rounded-lg
                                    px-4
                                    py-2
                                    mb-1
                                    transition-all

                                    ${
                                        active
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-400 hover:bg-slate-800 hover:text-white"
                                    }

                                `}
                            >

                                {child.title}

                                {child.badge && (

                                    <span className="rounded-full bg-red-500 px-2 text-xs text-white">
                                        {child.badge}
                                    </span>

                                )}

                            </Link>

                        );

                    })}

                </div>

            )}

        </div>

    );

}