import { Search, X } from "lucide-react";
import { useSidebar } from "./SidebarContext";

export default function SidebarSearch() {

    const {
        collapsed,
        search,
        setSearch,
    } = useSidebar();

    if (collapsed) {
        return null;
    }

    return (

        <div className="px-3 py-3 border-b border-slate-800">

            <div className="relative">

                <Search
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                />

                <input
                    type="text"
                    value={search}
                    placeholder="Search menu..."
                    onChange={(e) => setSearch(e.target.value)}
                    className="
                        w-full
                        bg-slate-800
                        text-white
                        rounded-lg
                        pl-10
                        pr-10
                        py-2
                        outline-none
                        border
                        border-slate-700
                        focus:border-blue-500
                    "
                />

                {search && (

                    <button

                        onClick={() => setSearch("")}

                        className="absolute right-3 top-2.5 text-gray-400"

                    >

                        <X size={18} />

                    </button>

                )}

            </div>

        </div>

    );

}