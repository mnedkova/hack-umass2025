import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({ children }) {
return (
    <div className="min-h-screen bg-gray-900">
        <Sidebar />
            <main className="pt-20 pl-20">{children}</main>
        <Footer />
    </div>
    );
}
