import { useEffect, useRef, useState } from "react";
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
  price: number;
  imageUrl: string;
  rating: number;
  isLike: boolean;
};

const BATCH_SIZE = 6;

export default function FoodListPage() {
  useAuthGuard();

  const [foods, setFoods] = useState<Food[]>([]);
  const [allFoods, setAllFoods] = useState<Food[]>([]);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [loading, setLoading] = useState(false);
  const [isBatchLoading, setIsBatchLoading] = useState(false);
  const [error, setError] = useState("");

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        setLoading(true);

        const data = await getFoods({ token });

        setAllFoods(data);
        setFoods(data.slice(0, BATCH_SIZE));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < allFoods.length &&
          !isBatchLoading
        ) {
          setIsBatchLoading(true);

          setTimeout(() => {
            const nextCount = visibleCount + 3;
            setFoods(allFoods.slice(0, nextCount));
            setVisibleCount(nextCount);
            setIsBatchLoading(false);
          }, 400);
        }
      },
      { threshold: 1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, allFoods, isBatchLoading]);

  const handleAddToCart = async (data: {
    foodId: string;
    quantity: number;
  }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const carts = await getCarts({ token });

      const existingCart = carts.find(
        (item: any) => item.food.id === data.foodId,
      );

      if (!existingCart) {
        await addToCart(data.foodId, 1, { token });

        const updatedCarts = await getCarts({ token });

        const newCartItem = updatedCarts.find(
          (item: any) => item.food.id === data.foodId,
        );

        if (!newCartItem) {
          throw new Error("Cart item tidak ditemukan");
        }

        await updateCartQuantity(newCartItem.id, data.quantity, { token });
      } else {
        const totalQuantity = existingCart.quantity + data.quantity;
        await updateCartQuantity(existingCart.id, totalQuantity, { token });
      }

      toast.success("Item berhasil ditambahkan ke cart");
    } catch (err: any) {
      toast.error(err.message || "Gagal menambahkan ke cart");
    }
  };

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
    } catch {
      setFoods((prev) =>
        prev.map((food) => (food.id === foodId ? { ...food, isLike } : food)),
      );

      toast.error("Gagal mengubah favorite");
    }
  };

  return (
    <div className="bg-[#3E3F29] min-h-screen flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-6 flex-1">
        <h1 className="text-2xl text-[#F1F0E4] font-bold mb-4">Food List</h1>

        {error && <p className="text-red-500">{error}</p>}

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

        {isBatchLoading && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {Array.from({ length: BATCH_SIZE }).map((_, index) => (
              <FoodCard key={index} loading />
            ))}
          </ul>
        )}

        <div
          ref={loadMoreRef}
          className="h-12 flex justify-center items-center mt-6"
        >
          {loading && <p className="text-white">Loading...</p>}
          {visibleCount >= allFoods.length && <p className="text-gray-400"></p>}
        </div>
      </main>

      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  );
}
