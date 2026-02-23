import { useEffect, useState } from "react";
import { Navbar } from "../../components/navbar";
import { FoodCard } from "../../components/food/foodcard";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { getFavoriteFoods, unlikeFood } from "@/services/food.service";
import {
  addToCart,
  getCarts,
  updateCartQuantity,
} from "@/services/cart.service";
import { Footer } from "@/components/footer";
import { toast, Toaster } from "sonner";

type FavoriteFood = {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  price: number | null;
  rating: number;
  isLike: boolean;
};

export default function FavoritePage() {
  useAuthGuard("user-only");

  const [foods, setFoods] = useState<FavoriteFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Favorite Food
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const data = await getFavoriteFoods({ token });
      setFoods(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  //Tombol Unlike
  const handleUnlike = async (foodId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await unlikeFood(foodId, { token });

      setFoods((prev) => prev.filter((food) => food.id !== foodId));

      toast.success("Dihapus dari favorite 🤍", {
        duration: 2000,
      });
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus dari favorite", {
        duration: 3000,
      });
    }
  };

  //Tombol Tambah Cart
  const handleAddToCart = async (data: {
    foodId: string;
    quantity: number;
  }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Ambil cart terbaru
      const carts = await getCarts({ token });

      // Cek apakah food sudah ada di cart
      const existingCart = carts.find(
        (item: any) => item.food.id === data.foodId,
      );

      if (!existingCart) {
        /**
         * Jika BELUM ADA
         * - add cart (backend bikin quantity = 1)
         */
        await addToCart(data.foodId, 1, { token });

        // ambil ulang cart
        const updatedCarts = await getCarts({ token });

        const newCartItem = updatedCarts.find(
          (item: any) => item.food.id === data.foodId,
        );

        if (!newCartItem) {
          throw new Error("Cart item tidak ditemukan");
        }

        // set quantity sesuai pilihan user
        await updateCartQuantity(newCartItem.id, data.quantity, { token });
      } else {
        /**
         * Jika SUDAH ADA
         * - jumlahkan quantity
         */
        const totalQuantity = existingCart.quantity + data.quantity;

        await updateCartQuantity(existingCart.id, totalQuantity, { token });
      }

      toast.success("Item berhasil ditambahkan ke cart");
    } catch (err: any) {
      toast.error(err?.message || "Gagal menambahkan ke cart");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#3E3F29]">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl text-[#F1F0E4] font-bold mb-6">
            Favorite Foods
          </h1>
          {error && <p className="text-red-500">{error}</p>}

          {/* Skeleton */}
          {loading && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <FoodCard key={index} loading />
              ))}
            </ul>
          )}

          {/* Card Data Food */}
          {!loading && !error && (
            <>
              {foods.length === 0 ? (
                <p className="text-[#F1F0E4]">Belum ada makanan favorit</p>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {foods.map((food) => (
                    <FoodCard
                      key={food.id}
                      {...food}
                      isLike
                      onToggleLike={() => handleUnlike(food.id)}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
}
