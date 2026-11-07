import menu from "./menu";
import SidebarItem from "./SidebarItem";
import SidebarDropdown from "./SidebarDropdown";
import { useSidebar } from "./SidebarContext";

export default function SidebarMenu({
    permissions = [],
}) {
    const { search } = useSidebar();
    const hasPermission = (item) => {

        if (!item.permissions || item.permissions.length === 0) {
            return true;
        }
        return item.permissions.some(permission =>
            permissions.includes(permission)
        );
    };
    const filterChildren = (children) => {
        if (!children) {
            return [];
        }
        return children.filter(child => {
            const matchSearch = child.title
                .toLowerCase()
                .includes(search.toLowerCase());
            return matchSearch;
        });
    };
    const filteredMenu = menu
        .map(item => {
            const children = filterChildren(item.children);
            const matchSearch = item.title
                .toLowerCase()
                .includes(search.toLowerCase());
            return {
                ...item,
                children,
                visible:
                    hasPermission(item)
                    &&
                    (
                        matchSearch
                        ||
                        children.length > 0
                    ),
            };
        })
        .filter(item => item.visible);
    return (
        <nav className="py-2">
            {
                filteredMenu.map(item => (
                    item.children && item.children.length > 0
                        ?
                        <SidebarDropdown
                            key={item.title}
                            item={item}
                        />
                        :
                        <SidebarItem
                            key={item.title}
                            item={item}
                        />
                ))
            }
        </nav>
    );
}