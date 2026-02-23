const authHeaders = (token: string) => ({
  apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
  Authorization: `Bearer ${token}`,
});

// Get Payment Method API

export async function getPaymentMethods(token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/payment-methods`,
    {
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(token),
      },
    },
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || "Gagal mengambil payment method");
  }

  return json.data;
}
