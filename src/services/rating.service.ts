type FetchOptions = {
  token: string;
};

// Get Food Rating API
export async function getFoodRatings(
  foodId: string,
  { token }: FetchOptions
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/food-rating/${foodId}`,
    {
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil rating");
  }

  return data.data;
}

// Create Food API
export async function submitFoodRating(
  foodId: string,
  rating: number,
  review: string,
  { token }: FetchOptions
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/rate-food/${foodId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, review }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal submit rating");
  }

  return data;
}
