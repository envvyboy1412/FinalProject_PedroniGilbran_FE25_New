import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { getMyProfile, updateProfile } from "@/services/user.service";
import { Toaster, toast } from "sonner";

export default function ProfilePage() {
  useAuthGuard("user-only");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  // modal
  const [openModal, setOpenModal] = useState(false);
  // form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // image
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const data = await getMyProfile(token);
      setUser(data);
      setPreviewImage(data.profilePictureUrl ?? "");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleOpenModal = () => {
    if (!user) return;
    setName(user.name ?? "");
    setEmail(user.email ?? "");
    setPhoneNumber(user.phoneNumber ?? "");
    setProfilePicture(null);
    setOpenModal(true);
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran maksimal 2MB");
      return;
    }
    setProfilePicture(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await updateProfile({
        token,
        name,
        email,
        phoneNumber,
        profilePicture,
      });

      toast.success("Profil berhasil diperbarui 🎉", {
        duration: 3000,
      });

      setOpenModal(false);
      fetchProfile();
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui profil", {
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#3E3F29]">
      <Navbar />

      <main className="flex-1 px-6 py-12">
        <section className="max-w-3xl mx-auto rounded-2xl p-6 border-0 shadow-lg shadow-[#7D8D86] bg-[#7D8D86] ">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {user && (
            <>
              <h1 className="text-3xl font-bold mb-8 text-[#F1F0E4] text-center">
                MY ACCOUNT
              </h1>

              <div className="flex flex-col items-center text-center p-4  space-y-3">
                <img
                  src={user.profilePictureUrl || "/avatar-placeholder.png"}
                  className="w-32 h-32 rounded-full object-cover"
                />

                <h2 className="text-xl font-semibold text-[#F1F0E4]">
                  {user.name}
                </h2>
                <p className="text-[#F1F0E4]">{user.email}</p>
                <p className="capitalize text-[#F1F0E4]">{user.role}</p>
                <p className="text-[#F1F0E4]">{user.phoneNumber}</p>

                <button
                  onClick={handleOpenModal}
                  style={{
                    fontSize: "17px",
                    padding: "0.5em 2em",
                    boxShadow: "2px 2px 4px rgba(0,0,0,0.4)",
                    background: "#BCA88D",
                    color: "white",
                    borderRadius: "4px",
                  }}
                  className="mt-4 active:translate-y-1 hover:bg-linear-to-r hover:from-blue-500 hover:to-cyan-400"
                >
                  Update Profile
                </button>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />

      <Toaster position="top-center" richColors />

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl p-6 bg-[#3E3F29]">
            <h2 className="text-xl font-bold text-center mb-6 text-[#F1F0E4]">
              Edit User Profile
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-[#F1F0E4]">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full  rounded px-3 py-2 bg-[#7D8D86]"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-[#F1F0E4]">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full  rounded px-3 py-2 bg-[#7D8D86] shadow-2xl"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-[#F1F0E4]">
                  Profile Picture
                </label>

                <div className="flex flex-col items-center gap-3">
                  <img
                    src={previewImage || "/avatar-placeholder.png"}
                    className="w-40 h-40 object-cover rounded-md "
                  />

                  <input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />

                  <label
                    htmlFor="profilePicture"
                    className="cursor-pointer px-4 py-2 rounded bg-[#7D8D86] text-white text-sm"
                  >
                    Pilih Foto
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 text-[#F1F0E4]">
                  Phone Number
                </label>
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full  rounded px-3 py-2 bg-[#7D8D86]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="cursor-pointer transition-all bg-red-700 text-white text-sm font-medium px-5 py-1.5 rounded-lg border-red-500 border-b-4 hover:brightness-110 hover:-translate-y-px hover:border-b-[6px] active:border-b-2 active:brightness-90 active:translate-y-0.5"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="cursor-pointer transition-all bg-green-700 text-white text-sm font-medium px-5 py-1.5 rounded-lg border-green-500 border-b-4 hover:brightness-110 hover:-translate-y-px hover:border-b-[6px] active:border-b-2 active:brightness-90 active:translate-y-0.5"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
