import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { getFoods, adminDeleteFood } from "@/services/food.service";
import FoodForm from "@/components/admin/foodform";
import { toast, Toaster } from "sonner";

type Food = {
  ingredients: string[];
  description: string;
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export default function AdminFoodPage() {
  useAuthGuard("admin-only");
  const router = useRouter();

  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editFood, setEditFood] = useState<Food | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(foods.length / itemsPerPage);

  const paginatedFoods = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return foods.slice(start, start + itemsPerPage);
  }, [foods, currentPage]);

  const fetchFoods = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      setLoading(true);
      const data = await getFoods({ token });
      setFoods(data);
      setCurrentPage(1);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data food");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleDelete = (foodId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    toast("Yakin ingin menghapus food ini?", {
      action: {
        label: "Hapus",
        onClick: async () => {
          try {
            await adminDeleteFood(foodId, { token });
            setFoods((prev) => prev.filter((food) => food.id !== foodId));
            toast.success("Food berhasil dihapus");
          } catch (err: any) {
            toast.error(err.message || "Gagal menghapus food");
          }
        },
      },
      cancel: {
        label: "Batal",
        onClick: () => {},
      },
    });
  };

  return (
    <main className="min-h-screen bg-[#3E3F29] p-6">
      <div className="max-w-6xl mx-auto bg-[#7D8D86] rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-[#F1F0E4]">
            Manajemen Food
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 rounded-lg bg-[#F1F0E4] hover:bg-[#BCA88D] text-[#3A2F24] hover:text-[#2A1E12] font-semibold transition"
            >
              Kembali
            </button>

            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 rounded-lg bg-[#F1F0E4] hover:bg-[#BCA88D] text-[#3A2F24] hover:text-[#2A1E12] font-semibold hover:opacity-90 transition"
            >
              Tambah Food
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : foods.length === 0 ? (
          <p className="text-gray-600">Belum ada data food.</p>
        ) : (
          <>
            <div className="overflow-hidden border border-gray-200 rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium">
                      Food Name
                    </th>
                    <th className="px-5 py-3 text-left font-medium">Price</th>
                    <th className="px-5 py-3 text-left font-medium">Image</th>
                    <th className="px-5 py-3 text-center font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {paginatedFoods.map((food) => (
                    <tr key={food.id} className="hover:bg-[#BCA88D] transition">
                      <td className="px-5 py-4 font-medium text-[#F1F0E4]">
                        {food.name}
                      </td>

                      <td className="px-5 py-4 text-[#F1F0E4]">
                        Rp {Number(food.price).toLocaleString("id-ID")}
                      </td>

                      <td className="px-5 py-4">
                        <img
                          src={food.imageUrl}
                          alt={food.name}
                          className="w-14 h-14 rounded-lg object-cover border"
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setEditFood(food)}
                            className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                          >
                            ✏️
                          </button>

                          <button
                            onClick={() => handleDelete(food.id)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4 text-sm text-[#F1F0E4]">
              <p>
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1 rounded-lg text-black disabled:opacity-40 bg-[#F1F0E4] hover:bg-[#BCA88D]"
                >
                  ‹
                </button>

                <div className="px-4 py-1 rounded-lg border bg-[#3E3F29] text-white font-medium">
                  {currentPage}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1 rounded-lg text-black disabled:opacity-40 bg-[#F1F0E4] hover:bg-[#BCA88D]"
                >
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showForm && (
        <FoodForm
          onCancel={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchFoods();
            toast.success("Food berhasil ditambahkan");
          }}
        />
      )}

      {editFood && (
        <FoodForm
          mode="edit"
          foodId={editFood.id}
          initialData={{
            name: editFood.name,
            description: editFood.description,
            ingredients: editFood.ingredients,
            price: editFood.price,
            imageUrl: editFood.imageUrl,
          }}
          onCancel={() => setEditFood(null)}
          onSuccess={() => {
            setEditFood(null);
            fetchFoods();
            toast.success("Food berhasil diperbarui");
          }}
        />
      )}
      <Toaster position="top-right" richColors />
    </main>
  );
}
