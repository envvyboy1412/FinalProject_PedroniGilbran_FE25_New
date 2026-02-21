const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;

const authHeaders = (token: string) => ({
  apiKey: API_KEY,
  Authorization: `Bearer ${token}`,
});

// Get Payment Method API

export async function getPaymentMethods(token: string) {
  const res = await fetch(
    `${BASE_URL}/api/v1/payment-methods`,
    {
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(token),
      },
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json?.message || "Gagal mengambil payment method"
    );
  }

  return json.data;
}
