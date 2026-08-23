import Sidebar from "@/Components/Layout/Sidebar/Sidebar";

export default function AppLayout({ children }) {

    return (

        <div className="flex bg-slate-100">

            <Sidebar />

            <main className="flex-1 lg:ml-72 transition-all duration-300">

                {children}

            </main>

        </div>

    );

}