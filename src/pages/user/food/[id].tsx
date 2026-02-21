import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Navbar } from "../../../components/navbar";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { getFoodDetail, likeFood, unlikeFood } from "@/services/food.service";
import {
  addToCart,
  getCarts,
  updateCartQuantity,
} from "@/services/cart.service";
import { getFoodRatings, submitFoodRating } from "@/services/rating.service";
import { Footer } from "@/components/footer";

type FoodDetail = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  price: number | null;
  rating: number;
  isLike: boolean;
};

type Review = {
  id: string;
  rating: number;
  review: string;
  user: {
    name: string;
  };
};

export default function FoodDetailPage() {
  useAuthGuard();

  const router = useRouter();
  const { id } = router.query;

  const [food, setFood] = useState<FoodDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isAdmin =
    typeof window !== "undefined" && localStorage.getItem("role") === "admin";


  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const foodData = await getFoodDetail(id as string, { token });
        setFood(foodData);

        const ratingData = await getFoodRatings(id as string, { token });
        setReviews(ratingData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleToggleLike = async () => {
    if (!food || isAdmin) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (food.isLike) {
        await unlikeFood(food.id, { token });
      } else {
        await likeFood(food.id, { token });
      }

      setFood({ ...food, isLike: !food.isLike });
    } catch {
      alert("Gagal mengubah favorite");
    }
  };


const handleAddToCart = async (data: {
  foodId: string;
  quantity: number;
}) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    // 1️⃣ Ambil cart terbaru
    const carts = await getCarts({ token });

    // 2️⃣ Cek apakah food sudah ada di cart
    const existingCart = carts.find(
      (item: any) => item.food.id === data.foodId
    );

    if (!existingCart) {
      /**
       * 3️⃣ Jika BELUM ADA
       * - add cart (backend bikin quantity = 1)
       */
      await addToCart(data.foodId, 1, { token });

      // ambil ulang cart
      const updatedCarts = await getCarts({ token });

      const newCartItem = updatedCarts.find(
        (item: any) => item.food.id === data.foodId
      );

      if (!newCartItem) {
        throw new Error("Cart item tidak ditemukan");
      }

      // set quantity sesuai pilihan user
      await updateCartQuantity(
        newCartItem.id,
        data.quantity,
        { token }
      );
    } else {
      /**
       * 4️⃣ Jika SUDAH ADA
       * - jumlahkan quantity
       */
      const totalQuantity =
        existingCart.quantity + data.quantity;

      await updateCartQuantity(
        existingCart.id,
        totalQuantity,
        { token }
      );
    }

    alert("Berhasil ditambahkan ke cart");
  } catch (err: any) {
    alert(err.message);
  }
};


  const handleSubmitRating = async () => {
    if (!food || userRating === 0 || isAdmin) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      await submitFoodRating(food.id, userRating, userReview, { token });

      const refreshed = await getFoodRatings(food.id, { token });
      setReviews(refreshed);

      setUserRating(0);
      setUserReview("");
      alert("Rating berhasil dikirim");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-6">
          <p>Loading food detail...</p>
        </main>
      </>
    );
  }

  if (!food || error) {
    return (
      <>
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-red-500">{error || "Food tidak ditemukan"}</p>
        </main>
      </>
    );
  }

  return (
    <div className="bg-[#3E3F29]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-2xl border-0 shadow-lg shadow-[#7D8D86] bg-[#7D8D86]">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-80 object-cover rounded-lg"
          />

          <div>
            <div className="flex items-center gap-32 md:gap-72">
              <h1 className="text-3xl text-[#F1F0E4] font-bold">{food.name}</h1>

              {!isAdmin && (
                <button onClick={handleToggleLike} className="text-3xl">
                  {food.isLike ? "❤️" : "🤍"}
                </button>
              )}
            </div>

            <p className="text-[#F1F0E4] mt-3">{food.description}</p>

            <p className="text-xl text-[#F1F0E4] font-semibold mt-4">
              Rp {food.price ? food.price.toLocaleString("id-ID") : "-"}
            </p>

            {!isAdmin && (
              <div className="flex items-center gap-4 mt-6">
                <div className="flex bg-[#A89276] items-center rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-lg hover:bg-[#BCA88D]"
                  >
                    −
                  </button>

                  <span className="px-4 text-sm  ">{quantity}</span>

                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1 text-lg hover:bg-[#BCA88D]"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() =>
                    handleAddToCart({
                      foodId: food.id,
                      quantity,
                    })
                  }
                  className="bg-[#A89276] hover:bg-[#BCA88D] text-white px-5 py-2 rounded-lg"
                >
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {!isAdmin && (
          <section className="mt-12 p-6 shadow-lg border-0 rounded-2xl shadow-[#7D8D86] bg-[#7D8D86] ">
            <h2 className="text-xl font-semibold mb-3">Beri Rating</h2>

            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setUserRating(star)}
                  className={`text-3xl ${
                    star <= userRating ? "text-yellow-500" : "text-[#F1F0E4]"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              placeholder="Tulis review kamu (opsional)"
              className="w-full border-2 rounded-lg p-3 mb-4"
              rows={3}
            />

            <button
              disabled={userRating === 0 || submitting}
              onClick={handleSubmitRating}
              className="bg-[#A89276] hover:bg-[#BCA88D] text-[#F1F0E4] px-5 py-2 rounded-lg disabled:opacity-50"
            >
              {submitting ? "Mengirim..." : "Submit Rating"}
            </button>
          </section>
        )}

        <section className="mt-10 p-6 shadow-lg border-0 rounded-2xl shadow-[#7D8D86] bg-[#7D8D86]">
          <h2 className="text-2xl font-semibold  mb-4 ">Reviews</h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500 ">Belum ada review</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="border rounded-lg bg-[#F1F0E4] p-4">
                  <strong className="font-medium font-Bungee">
                    {r.user.name}
                  </strong>{" "}
                  <span className="text-yellow-500">
                    {"★".repeat(r.rating)}
                  </span>
                  <p className="text-black font-bold mt-1">{r.review || "-"}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
