import Navbar from '@/Components/Layout/Navbar';
import Sidebar from '@/Components/Layout/Sidebar';
import Footer from '@/Components/Layout/Footer';

export default function AppLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Navbar />
                <main className="flex-1 p-6">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}