import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { uploadImage, registerUser } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<"user" | "admin" | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitRegister = async () => {
    /* Validasi Form*/
    if (!role) {
      toast.error("Role wajib dipilih");
      return;
    }

    if (!name || !email || !phoneNumber || !password || !passwordRepeat) {
      toast.error("Semua field wajib diisi");
      return;
    }

    if (!profileImage) {
      toast.error("Foto profil wajib diupload");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    if (password !== passwordRepeat) {
      toast.error("Password dan konfirmasi password tidak sama");
      return;
    }

    setLoading(true);

    try {
      /* Upload Image */
      const imageUrl = await uploadImage(profileImage);

      /* Register */
      await registerUser({
        name,
        email,
        password,
        passwordRepeat,
        role,
        phoneNumber,
        profilePictureUrl: imageUrl,
      });

      toast.success("Register berhasil");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Register gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3E3F29] px-4">
      <ToastContainer theme="dark" />
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden flex">

        {/* Kiri */}
        <div
          className="hidden md:flex w-2/5 bg-cover bg-center relative text-white"
          style={{ backgroundImage: "url('/images/auth_pic.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex flex-col justify-center text-center px-10">
            <h1 className="text-3xl font-bold mb-4">
              Experience Culinary Excellence.
            </h1>
            <p className="text-sm opacity-90">
              Join thousands of food enthusiasts and discover the best local
              flavors delivered straight to your doorstep.
            </p>
          </div>
        </div>

        {/* Kanan */}
        <div className="w-full md:w-3/5 px-6 py-10 flex justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">
              Create Your Account
            </h2>

            {/* Role */}
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-500 mb-2">
                PILIH ROLE
              </p>
              <div className="flex bg-[#A89276] rounded-lg p-1">
                {["user", "admin"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r as "user" | "admin")}
                    className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${
                      role === r
                        ? "bg-[#BCA88D] text-black shadow"
                        : "text-[#F1F0E4]"
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <label
                htmlFor="profileImage"
                className="relative w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-gray-400 text-sm text-center">
                    Choose
                    <br />
                    Photo
                  </span>
                )}

                <div className="absolute bottom-1 right-1 w-7 h-7 bg-[#BCA88D] text-white rounded-full flex items-center justify-center">
                  +
                </div>
              </label>

              <input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (!file.type.startsWith("image/")) {
                    toast.error("File harus berupa gambar");
                    return;
                  }

                  if (file.size > 1 * 1024 * 1024) {
                    toast.error("Ukuran gambar maksimal 1MB");
                    return;
                  }

                  setProfileImage(file);
                  setPreviewImage(URL.createObjectURL(file));
                }}
              />
            </div>

            {/* Form */}
            <input
              placeholder="Full Name"
              className="w-full border px-4 py-3 rounded-md mb-3"
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full border px-4 py-3 rounded-md mb-3"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Phone Number"
              className="w-full border px-4 py-3 rounded-md mb-3"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <div className="flex gap-2 mb-4">
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full border px-4 py-3 rounded-md pr-10"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? "🫣" : "🤔"}
                </span>
              </div>

              <div className="relative w-full">
                <input
                  type={showPasswordRepeat ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full border px-4 py-3 rounded-md pr-10"
                  onChange={(e) => setPasswordRepeat(e.target.value)}
                />
                <span
                  onClick={() =>
                    setShowPasswordRepeat(!showPasswordRepeat)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPasswordRepeat ? "🫣" : "🤔"}
                </span>
              </div>
            </div>

            <button
              onClick={submitRegister}
              disabled={loading}
              className="w-full bg-[#A89276] hover:bg-[#BCA88D] text-white py-3 rounded-md font-semibold disabled:opacity-60"
            >
              {loading ? "Loading..." : "Create Account"}
            </button>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#BCA88D] font-bold hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
