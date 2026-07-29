import UserMenu from "./UserMenu";

export default function Navbar() {
    return (
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
            <div>
                <h1 className="text-xl font-semibold text-gray-800">
                    School Management System
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 17h5l-1.4-1.4A2 2 0 0118 14.17V11a6 6 0 10-12 0v3.17a2 2 0 01-.59 1.42L4 17h5m6 0a3 3 0 11-6 0"
                        />
                    </svg>
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        3
                    </span>
                </button>
                <UserMenu />
            </div>
        </header>
    );
}