type LoginPayload = {
  email: string;
  password: string;
};

// Login
export async function loginUser(payload: LoginPayload) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Email atau password salah",
    );
  }

  return {
    token: data.token,
    role: data.user.role,
  };
}

// Upload Image
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/upload-image`,
    {
      method: "POST",
      headers: {
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
      },
      body: formData,
    },
  );

  const data = await res.json();

  if (!res.ok || data?.status !== "OK") {
    throw new Error(data?.message || "Upload image gagal");
  }

  const imageUrl = data?.data?.imageUrl ?? data?.url ?? data?.data?.url ?? null;

  if (!imageUrl) {
    throw new Error("Image URL tidak valid");
  }

  return imageUrl;
}

// Register
type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
  role: "user" | "admin";
  phoneNumber: string;
  profilePictureUrl: string;
};

export async function registerUser(payload: RegisterPayload) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Register gagal");
  }

  return data;
}
