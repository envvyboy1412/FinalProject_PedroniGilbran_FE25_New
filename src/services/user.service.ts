const authHeaders = (token: string) => ({
  "Content-Type": "application/json",
  apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
  Authorization: `Bearer ${token}`,
});

// Get Profile User
export async function getMyProfile(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user`, {
    headers: authHeaders(token),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil profile");
  }

  return json.user;
}

//Update Profile API
export async function updateProfile(params: {
  token: string;
  name: string;
  email: string;
  phoneNumber: string;
  profilePicture?: File | null;
}) {
  const formData = new FormData();

  formData.append("name", params.name);
  formData.append("email", params.email);
  formData.append("phoneNumber", params.phoneNumber);

  if (params.profilePicture) {
    formData.append("profilePicture", params.profilePicture);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/update-profile`,
    {
      method: "POST",
      headers: {
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
        Authorization: `Bearer ${params.token}`,
      },
      body: formData,
    },
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Gagal update profile");
  }

  return json;
}


// ================= ADMIN Role API =================

// Get All Users (Admin)
export async function adminGetAllUsers(token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/all-user`,
    {
      headers: authHeaders(token),
    },
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil data user");
  }

  return json.data || json.users;
}

// Update User Role (Admin)
export async function adminUpdateUserRole(params: {
  token: string;
  userId: string;
  role: "admin";
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/update-user-role/${params.userId}`,
    {
      method: "POST",
      headers: authHeaders(params.token),
      body: JSON.stringify({
        role: params.role,
      }),
    },
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Gagal update role user");
  }

  return json;
}