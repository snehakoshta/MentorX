import { Outlet } from "react-router-dom";
import Navbar from "./navbar.jsx";
import Footer from "./footer.jsx";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar always on top */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  );
}
