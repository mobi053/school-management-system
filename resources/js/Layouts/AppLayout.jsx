import Sidebar from "@/Components/Layout/Sidebar/Sidebar";

export default function AppLayout({ children }) {
    return (
        <div className="flex min-h-screen w-full bg-slate-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="min-w-0 flex-1 transition-all duration-300">
                {children}
            </main>
        </div>
    );
}