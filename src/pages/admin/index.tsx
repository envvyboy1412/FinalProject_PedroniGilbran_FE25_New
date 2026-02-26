import { useAuthGuard } from "@/hooks/useAuthGuard";
import { logout } from "@/services/logout.service";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";

export default function AdminDashboardPage() {
  useAuthGuard("admin-only");
  const router = useRouter();

  // Button Logout
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await logout(token);
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      localStorage.clear();
      toast.success("Logout berhasil");

      setTimeout(() => {
        router.replace("/login");
      }, 3000);
    }
  };

  return (
    <main className="min-h-screen bg-[#3E3F29] flex items-center  text-[#F1F0E4] justify-center px-4">
      <ToastContainer theme="dark" />
      <div className="bg-[#7D8D86] rounded-xl shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2 ">Admin Dashboard</h1>
        <p className="mb-6">Selamat datang di halaman admin.</p>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/admin/foods")}
            className="w-full bg-[#BCA88D] font-bold py-2 rounded"
          >
            Add New Food
          </button>

          <button
            onClick={() => router.push("/admin/transaction")}
            className="w-full bg-[#BCA88D] font-bold py-2 rounded"
          >
            Transaction Management
          </button>

          <button
            onClick={() => router.push("/admin/role")}
            className="w-full bg-[#BCA88D] font-bold py-2 rounded"
          >
            User Management
          </button>

          <button
            onClick={() => router.push("/user")}
            className="w-full bg-blue-600 font-bold py-2 rounded"
          >
            Masuk ke Halaman User
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 font-bold py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
