import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const [search, setSearch] = useState("");
    const toggleSidebar = () => {
        setCollapsed(prev => !prev);
    };

    const toggleMobileSidebar = () => {
        setMobileOpen(prev => !prev);
    };

    return (

        <SidebarContext.Provider
            value={{
                collapsed,
                mobileOpen,
                toggleSidebar,
                toggleMobileSidebar,
                search,
                setSearch,
            }}
        >
            {children}
        </SidebarContext.Provider>

    );

}

export function useSidebar() {
    return useContext(SidebarContext);
}