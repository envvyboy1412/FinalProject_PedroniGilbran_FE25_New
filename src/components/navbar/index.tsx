import { useEffect, useState } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import { getCarts } from "@/services/cart.service";
import { logout } from "@/services/logout.service";
import { getMyProfile } from "@/services/user.service";
import { useRouter } from "next/router";

export function Navbar() {
  const router = useRouter();
  const [userOpen, setUserOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  const isAdmin = user?.role === "admin";

  const fetchCartCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const carts = await getCarts({ token });
    const total = carts.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0,
    );
    setCartCount(total);
  };

  // Fetch User
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUserProfile = async () => {
      try {
        const user = await getMyProfile(token);
        setUser(user);
      } catch (error) {
        console.log("Fetch user error:", error);
      }
    };

    fetchUserProfile();
  }, []);

  //notif cart
  useEffect(() => {
    fetchCartCount();

    window.addEventListener("cart-updated", fetchCartCount);

    return () => {
      window.removeEventListener("cart-updated", fetchCartCount);
    };
  }, []);

  // Button Logout
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await logout(token);
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      localStorage.clear();
      toast.success("Logout berhasil");

      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    }
  };

  return (
    <nav className="bg-[#7D8D86] relative z-50">
      <ToastContainer theme="dark" />

      <div className="flex items-center justify-between max-w-6xl mx-auto p-6">
        <div className="text-[#F1F0E4] font-badscript font-bold text-2xl">
          Dawn Winery
        </div>

        <div className="hidden md:flex gap-12 text-white font-semibold">
          <Link
            href="/user"
            className="relative
          before:content-[''] before:absolute before:left-0 before:bottom-0
          before:h-0.5 before:w-0 before:bg-[#A6A6A6]
          before:transition-[width] before:duration-800
          before:ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]

          after:content-[''] after:absolute after:right-0 after:bottom-0
          after:h-0.5 after:w-0 after:bg-[#A6A6A6]
          after:transition-[width] after:duration-800
          after:ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]

          hover:before:w-full hover:after:w-full"
          >
            Home
          </Link>

          <Link
            href="/user/foodlist"
            className="relative
          before:content-[''] before:absolute before:left-0 before:bottom-0
          before:h-0.5 before:w-0 before:bg-[#A6A6A6]
          before:transition-[width] before:duration-800
          before:ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]

          after:content-[''] after:absolute after:right-0 after:bottom-0
          after:h-0.5 after:w-0 after:bg-[#A6A6A6]
          after:transition-[width] after:duration-800
          after:ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]

          hover:before:w-full hover:after:w-full"
          >
            Food
          </Link>

          {!isAdmin && (
            <Link
              href="/user/favorite"
              className="relative
            before:content-[''] before:absolute before:left-0 before:bottom-0
            before:h-0.5 before:w-0 before:bg-[#A6A6A6]
            before:transition-[width] before:duration-800
            before:ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]

            after:content-[''] after:absolute after:right-0 after:bottom-0
            after:h-0.5 after:w-0 after:bg-[#A6A6A6]
            after:transition-[width] after:duration-800
            after:ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]

            hover:before:w-full hover:after:w-full"
            >
              Favorite
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-6 relative">
          {!isAdmin && (
            <Link href="/user/cart" className="relative text-white text-2xl">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={() => setUserOpen(!userOpen)}
            className="flex items-center gap-2 text-white"
          >
            {user?.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

            <span className="hidden md:block text-sm font-semibold">
              {user?.name}
            </span>
          </button>

          {userOpen && (
            <div className="absolute right-0 top-12 bg-white rounded-md shadow-lg w-52">
              <div className="px-4 py-3 border-b">
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>

              {/* Tombol khusus ADMIN */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
              )}

              {/* Menu USER */}
              {!isAdmin && (
                <Link
                  href="/user/history"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  History
                </Link>
              )}

              {!isAdmin && (
                <Link
                  href="/user/edit-profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Edit Profile
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#ACBAC4] border-t">
          <div className="flex flex-col gap-4 p-6 text-white font-semibold">
            <Link href="/user" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/user/foodlist" onClick={() => setMenuOpen(false)}>
              Food
            </Link>

            {!isAdmin && (
              <Link href="/user/favorite" onClick={() => setMenuOpen(false)}>
                Favorite
              </Link>
            )}

            {!isAdmin && (
              <Link
                href="/user/cart"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2"
              >
                Cart
                {cartCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            <hr className="border-white/40" />

            {!isAdmin && (
              <Link href="/user/history" onClick={() => setMenuOpen(false)}>
                History
              </Link>
            )}

            {!isAdmin && (
              <Link
                href="/user/edit-profile"
                onClick={() => setMenuOpen(false)}
              >
                Edit Profile
              </Link>
            )}

            <button onClick={handleLogout} className="text-left text-red-200">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
