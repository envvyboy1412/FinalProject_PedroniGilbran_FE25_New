// services/logout.service.ts

export async function logout(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Logout gagal");
  }

  return json;
}