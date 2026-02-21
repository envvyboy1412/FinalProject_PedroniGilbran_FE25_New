type FetchOptions = {
  token: string;
};

//Get Carts API
export async function getCarts({ token }: FetchOptions) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/carts`,
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
    throw new Error(data.message || "Gagal ambil cart");
  }

  return data.data;
}

//Add Carts API
export async function addToCart(
  foodId: string,
  quantity: number,
  { token }: FetchOptions
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/add-cart`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ foodId, quantity }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal add to cart");
  }

  return data.data;
}

//Update Quantity Cart API
export async function updateCartQuantity(
  cartId: string,
  quantity: number,
  { token }: FetchOptions
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/update-cart/${cartId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal update quantity");
  }

  return data;
}

// Delete Cart API
export async function deleteCart(
  cartId: string,
  { token }: FetchOptions
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/delete-cart/${cartId}`,
    {
      method: "DELETE",
      headers: {
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal menghapus item cart");
  }

  return data;
}
