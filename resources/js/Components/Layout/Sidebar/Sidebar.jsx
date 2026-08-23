import SidebarHeader from "./SidebarHeader";
import menu from "./menu";
import { useSidebar } from "./SidebarContext";
import SidebarMenu from "./SidebarMenu";
import SidebarSearch from "./SidebarSearch";

export default function Sidebar() {

    const {
        collapsed,
        mobileOpen,
    } = useSidebar();

    return (
        <>
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
            )}
            <aside
                className={`
                fixed lg:relative
                z-50
                h-screen
                bg-slate-900
                border-r
                border-slate-800
                transition-all
                duration-300
                overflow-hidden
                ${collapsed ? "w-20" : "w-72"}
                ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                <SidebarHeader />
                <SidebarSearch />
                <div className="h-[calc(100vh-64px)] overflow-y-auto">
                    <SidebarMenu />
                </div>
            </aside>
        </>
    );
}