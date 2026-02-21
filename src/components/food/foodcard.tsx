import { useState } from "react";
import { useRouter } from "next/router";

type FoodCardProps = {
  loading?: boolean;

  id?: string;
  name?: string;
  price?: number | null;
  imageUrl?: string;
  rating?: number;
  isLike?: boolean;

  onToggleLike?: () => void;
  onAddToCart?: (data: {
    foodId: string;
    quantity: number;
  }) => void;
};

//Skeleton FoodCard
function FoodCardSkeleton() {
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm bg-[#7D8D86] flex flex-col relative animate-pulse">
      <div className="absolute top-3 right-3 w-6 h-6 bg-gray-300 rounded-full" />
      <div className="w-full h-48 bg-gray-300" />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="h-5 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/3" />
        <div className="h-4 bg-gray-300 rounded w-1/4" />
        <div className="flex-1" />
        <div className="flex items-center justify-between gap-3">
          <div className="h-8 w-24 bg-gray-300 rounded-lg" />
          <div className="h-9 w-28 bg-gray-400 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// FoodCard
export function FoodCard(props: FoodCardProps) {
  if (props.loading) return <FoodCardSkeleton />;

  const {
    id,
    name,
    price,
    imageUrl,
    rating,
    isLike,
    onToggleLike,
    onAddToCart,
  } = props;

  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  if (!id || !name || !imageUrl || rating === undefined) {
    return null;
  }

  const role =
    typeof window !== "undefined"
      ? localStorage.getItem("role")
      : null;

  const isAdmin = role === "admin";

  const goToDetail = () => {
    router.push(`/user/food/${id}`);
  };

  return (
    <div className="border-0 rounded-xl overflow-hidden shadow-sm bg-[#7D8D86] flex flex-col relative">
      {/* Like/Unlike */}
      {!isAdmin && (
        <button
          onClick={onToggleLike}
          className="absolute top-3 right-3 text-2xl z-10"
        >
          {isLike ? "❤️" : "🤍"}
        </button>
      )}

      {/* Image */}
      <div
        onClick={goToDetail}
        className="w-full h-48  bg-gray-100 cursor-pointer"
      >
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3
          onClick={goToDetail}
          className="font-bold text-[#F1F0E4] text-lg cursor-pointer hover:underline"
        >
          {name}
        </h3>

        <div className="flex items-center gap-1 text-sm">
          {rating > 0 ? (
            <>
              <span className="text-[#F1F0E4]">
                {"★".repeat(Math.round(rating))}
              </span>
              <span className="text-[#F1F0E4]">({rating})</span>
            </>
          ) : (
            <span className="text-[#F1F0E4]">No rating</span>
          )}
        </div>

        <p className="text-gray-800 font-medium">
          Rp {price ? price.toLocaleString("id-ID") : "-"}
        </p>

        <div className="flex-1" />

        {/* Button Action */}
        {!isAdmin && onAddToCart && (
          <div className="flex items-center justify-between gap-3">
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
                onAddToCart({
                  foodId: id,
                  quantity,
                })
              }
              className="bg-[#A89276] hover:bg-[#BCA88D] text-white px-4 py-2 rounded-lg text-sm"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
