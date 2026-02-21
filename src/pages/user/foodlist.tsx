import { useEffect, useState } from "react";
import { Navbar } from "../../components/navbar";
import { FoodCard } from "../../components/food/foodcard";
import { Footer } from "@/components/footer";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { getFoods, likeFood, unlikeFood } from "@/services/food.service";
import {
  addToCart,
  getCarts,
  updateCartQuantity,
} from "@/services/cart.service";
import { toast, Toaster } from "sonner";

type Food = {
  id: string;
  name: string;
  price: number
  imageUrl: string;
  rating: number;
  isLike: boolean;
};

export default function FoodListPage() {
  // admin & user boleh masuk
  useAuthGuard();

  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Foodlist
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const data = await getFoods({ token });
        setFoods(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  //Tombol Tambah Cart
  const handleAddToCart = async (data: {
    foodId: string;
    quantity: number;
  }) => {
    try { 
      const token = localStorage.getItem("token");
      if (!token) return;

      //Ambil cart terbaru
      const carts = await getCarts({ token });

      //Cek apakah food sudah ada di cart
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

      toast.success("Item Telah ditambahkan", {
        duration: 3000,
      });
    } catch (err: any) {
      toast.error(err.message || "Gagal menambahkan ke cart", {
        duration: 3000,
      });
    }
  };

  //Tombol Like & Unlike
const handleToggleLike = async (foodId: string, isLike: boolean) => {
  setFoods((prev) =>
    prev.map((food) =>
      food.id === foodId ? { ...food, isLike: !isLike } : food,
    ),
  );

  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!isLike) {
      await likeFood(foodId, { token });
    } else {
      await unlikeFood(foodId, { token });
    }
    toast.success(
      !isLike ? "Ditambahkan ke favorite ❤️" : "Dihapus dari favorite 🤍",
      {
        duration: 2000,
      },
    );
  } catch (error) {
    setFoods((prev) =>
      prev.map((food) => (food.id === foodId ? { ...food, isLike } : food)),
    );

    toast.error("Gagal mengubah status favorite", {
      duration: 3000,
    });
  }
};

  /* ================= UI ================= */
  return (
    <div className="bg-[#3E3F29] min-h-screen flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-6 flex-1">
        <h1 className="text-2xl text-[#F1F0E4] font-bold mb-4">Food List</h1>

        {error && <p className="text-red-500">{error}</p>}

        {/* Skeleton */}
        {loading && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <FoodCard key={index} loading />
            ))}
          </ul>
        )}

        {/* FoodCard & Data */}
        {!loading && !error && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <FoodCard
                key={food.id}
                id={food.id}
                name={food.name}
                price={food.price}
                imageUrl={food.imageUrl}
                rating={food.rating}
                isLike={food.isLike}
                onToggleLike={() => handleToggleLike(food.id, food.isLike)}
                onAddToCart={handleAddToCart}
              />
            ))}
          </ul>
        )}
      </main>
      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  );
}
