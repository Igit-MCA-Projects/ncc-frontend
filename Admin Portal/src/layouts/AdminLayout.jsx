import { Outlet } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function AdminLayout() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <Navbar />
          <main className="flex-1 p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
