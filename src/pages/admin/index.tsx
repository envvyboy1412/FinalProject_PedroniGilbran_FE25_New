import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useRouter } from "next/router";

export default function AdminDashboardPage() {
  useAuthGuard("admin-only");
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.replace("/login");
  };

  return (
    <main className="min-h-screen bg-[#3E3F29] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Selamat datang di halaman admin.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => alert("Menu User Management (coming soon)")}
            className="w-full bg-black text-white py-2 rounded"
          >
            User Management
          </button>

          <button
            onClick={() => alert("Menu Transaction Management (coming soon)")}
            className="w-full bg-black text-white py-2 rounded"
          >
            Transaction Management
          </button>

          <button
            onClick={() => router.push("/user")}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Masuk ke Halaman User
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
