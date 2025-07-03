import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>
      {/* Add top padding equal to header height (e.g., 80px) */}
      <main className="flex-grow px-4 sm:px-6 py-8 pt-24 pb-32 b-32">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}