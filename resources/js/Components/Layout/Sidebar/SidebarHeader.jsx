import { Menu, School } from "lucide-react";
import { useSidebar } from "./SidebarContext";

export default function SidebarHeader() {

    const {
        collapsed,
        toggleSidebar,
    } = useSidebar();

    return (

        <div className="h-16 border-b border-slate-700 flex items-center justify-between px-4">

            <div className="flex items-center gap-3">

                <School
                    size={30}
                    className="text-blue-400"
                />

                {!collapsed && (

                    <div>

                        <h1 className="font-bold text-white">
                            SMS
                        </h1>

                        <p className="text-xs text-gray-400">
                            School Management
                        </p>

                    </div>

                )}

            </div>

            <button

                onClick={toggleSidebar}

                className="text-gray-300 hover:text-white"

            >

                <Menu size={22} />

            </button>

        </div>

    );

}