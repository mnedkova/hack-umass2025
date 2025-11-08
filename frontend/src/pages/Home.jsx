import FolderStack from "../components/FolderStack";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-900 relative overflow-hidden">
      <main className="flex-grow relative z-0">
        <FolderStack />
      </main>

      <div className="relative z-10 -mt-[350px] pointer-events-none">
        {/* Use pointer-events-none so footer doesn't block scroll */}
        <Footer />
      </div>
    </div>
  );
}