import Header from "./Header";
import {Outlet} from "react-router-dom";

export default function Layout() {
  return ( 
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-white shadow-inner py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 BoticsBay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}