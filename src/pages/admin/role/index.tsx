import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import {
  adminGetAllUsers,
  adminUpdateUserRole,
  getMyProfile,
} from "@/services/user.service";
import { toast, Toaster } from "sonner";
import AdminLayout from "@/components/layout/AdminLayout";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export default function AdminUsersPage() {
  useAuthGuard("admin-only");
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [myUserId, setMyUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(true);

      const profile = await getMyProfile(token);
      setMyUserId(profile.id);

      const data = await adminGetAllUsers(token);
      const onlyUsers = data.filter(
        (user: User) => user.role === "user"
      );

      setUsers(onlyUsers);
      setCurrentPage(1);
    } catch (err: any) {
      setError(err.message || "Gagal memuat user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmPromote = (user: User) => {
    toast(`Jadikan ${user.name} sebagai admin?`, {
      action: {
        label: "Ya, Jadikan Admin",
        onClick: async () => {
          try {
            const token = localStorage.getItem("token");
            if (!token) return;

            await adminUpdateUserRole({
              token,
              userId: user.id,
              role: "admin",
            });

            setUsers((prev) =>
              prev.filter((u) => u.id !== user.id)
            );

            toast.success("Role berhasil diubah menjadi admin");
          } catch (err: any) {
            toast.error(
              err.message || "Gagal mengubah role user"
            );
          }
        },
      },
      cancel: {
        label: "Batal",
        onClick: () => {},
      },
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = search.toLowerCase();
      return (
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
      );
    });
  }, [users, search]);

  const totalPages = Math.ceil(
    filteredUsers.length / itemsPerPage
  );

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl rounded-2xl bg-[#7D8D86] p-4 md:p-6 shadow-2xl">
        <div className="mb-6 flex flex-col md:flex-row gap-3 justify-between">
          <h1 className="text-xl font-semibold text-[#F1F0E4]">
            Manajemen User
          </h1>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg bg-[#F1F0E4] px-4 py-2 text-sm text-[#3A2F24]"
            />

          </div>
        </div>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        {loading ? (
          <p className="text-gray-200">Loading...</p>
        ) : paginatedUsers.length === 0 ? (
          <p className="text-gray-200">
            Tidak ada user yang ditemukan.
          </p>
        ) : (
          <>
            <div className="block md:hidden space-y-4">
              {paginatedUsers.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl bg-[#3E3F29] p-4 text-[#F1F0E4]"
                >
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">{user.name}</p>
                    <p>{user.email}</p>
                  </div>

                  <div className="mt-3 flex justify-end">
                    {user.id !== myUserId ? (
                      <button
                        onClick={() => confirmPromote(user)}
                        className="rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700"
                      >
                        Set Admin
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        -
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium">
                      Nama
                    </th>
                    <th className="px-5 py-3 text-left font-medium">
                      Email
                    </th>
                    <th className="px-5 py-3 text-center font-medium">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-5 py-4 font-medium text-[#F1F0E4]">
                        {user.name}
                      </td>

                      <td className="px-5 py-4 text-[#F1F0E4]">
                        {user.email}
                      </td>

                      <td className="px-5 py-4 text-center">
                        {user.id !== myUserId ? (
                          <button
                            onClick={() =>
                              confirmPromote(user)
                            }
                            className="rounded-lg bg-green-100 px-3 py-1 text-green-700"
                          >
                            Set Admin
                          </button>
                        ) : (
                          <span className="text-gray-400">
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-[#F1F0E4]">
              <p>
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((p) => p - 1)
                  }
                  className="rounded-lg bg-[#F1F0E4] px-3 py-1 text-black disabled:opacity-40"
                >
                  ‹
                </button>

                <div className="rounded-lg bg-[#3E3F29] px-4 py-1 text-white">
                  {currentPage}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => p + 1)
                  }
                  className="rounded-lg bg-[#F1F0E4] px-3 py-1 text-black disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <Toaster position="top-center" richColors />
    </AdminLayout>
  );
}