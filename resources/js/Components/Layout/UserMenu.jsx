import { useState } from "react";
import { Link } from "@inertiajs/react";

export default function UserMenu() {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3"
            >
                <img
                    src="https://i.pravatar.cc/40"
                    alt="User"
                    className="w-10 h-10 rounded-full"
                />
                <div className="text-left">
                    <p className="font-medium text-sm">
                        Admin
                    </p>
                    <p className="text-xs text-gray-500">
                        Administrator
                    </p>
                </div>
            </button>
            {
                open &&
                <div className="absolute right-0 mt-3 w-52 rounded-md shadow-lg bg-white border">
                    <Link
                        href="/profile"
                        className="block px-4 py-3 hover:bg-gray-100"
                    >
                        My Profile
                    </Link>
                    <Link
                        href="/settings"
                        className="block px-4 py-3 hover:bg-gray-100"
                    >
                        Settings
                    </Link>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="block text-left w-full px-4 py-3 hover:bg-gray-100 text-red-600"
                    >
                        Logout
                    </Link>
                </div>
            }
        </div>
    );
}