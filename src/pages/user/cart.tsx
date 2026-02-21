import { useEffect, useState } from "react";
import { Navbar } from "../../components/navbar";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import {
  getCarts,
  updateCartQuantity,
  deleteCart,
} from "@/services/cart.service";
import { Footer } from "@/components/footer";
import router from "next/router";

type CartItem = {
  id: string;
  quantity: number;
  food: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
  };
};

export default function CartPage() {
  useAuthGuard("user-only");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //Fetch Cart
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const data = await getCarts({ token });
      setCartItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  //Update Quantity
  const handleUpdateQuantity = async (cartId: string, quantity: number) => {
    if (quantity < 1) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await updateCartQuantity(cartId, quantity, { token });
      fetchCart();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete Item Cart
  const handleDeleteItem = async (cartId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await deleteCart(cartId, { token });
      fetchCart();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const totalHarga = cartItems.reduce(
    (total, item) => total + item.food.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#3E3F29]">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl text-[#F1F0E4] font-bold mb-6">Ready For Checkout</h1>

          {/* ERROR */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Loading Skleton */}
          {loading && (
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-40 bg-gray-300 rounded" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cart List Skelton*/}
                <div className="md:col-span-2 space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 border rounded-lg p-4"
                    >
                      <div className="w-20 h-20 bg-gray-300 rounded" />

                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-2/3 bg-gray-300 rounded" />
                        <div className="h-4 w-1/3 bg-gray-300 rounded" />
                        <div className="h-6 w-24 bg-gray-300 rounded mt-2" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skeleton Summary*/}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="h-5 w-24 bg-gray-300 rounded" />
                  <div className="h-4 w-full bg-gray-300 rounded" />
                  <div className="h-10 w-full bg-gray-300 rounded" />
                </div>
              </div>
            </div>
          )}

          {/* Data Cart */}
          {!loading && !error && (
            <>
              {cartItems.length === 0 ? (
                <div className="bg-[#7D8D86]  backdrop-blur rounded-xl p-6 shadow text-gray-600">
                  Cart masih kosong
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Cart List*/}
                  <div className="md:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 bg-[#7D8D86] backdrop-blur border border-[#7D8D86] rounded-xl p-4 shadow-sm hover:shadow-md transition"
                      >
                        <img
                          src={item.food.imageUrl}
                          alt={item.food.name}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />

                        <div className="flex-1">
                          <h3 className="font-semibold text-[#F1F0E4]">
                            {item.food.name}
                          </h3>
                          <p className="text-[#F1F0E4]">
                            Rp{" "}
                            {item.food.price !== null
                              ? item.food.price.toLocaleString("id-ID")
                              : "-"}
                          </p>

                          <div className="flex items-center text-[#F1F0E4] gap-3 mt-3">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-md  bg-[#A89276] hover:bg-[#BCA88D] transition"
                            >
                              −
                            </button>

                            <span className="font-medium">{item.quantity}</span>

                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-md  bg-[#A89276] hover:bg-[#BCA88D] transition"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="cursor-pointer transition-all bg-[#A89276] text-white text-sm font-medium px-5 py-1.5 rounded-lg border-[#BCA88D] border-b-4 hover:brightness-110 hover:-translate-y-px hover:border-b-[6px] active:border-b-2 active:brightness-90 active:translate-y-0.5"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="bg-[#7D8D86] backdrop-blur border border-[#7D8D86] rounded-xl p-5 h-fit shadow-sm">
                    <h2 className="font-semibold text-lg mb-4 text-[#F1F0E4]">
                      Summary
                    </h2>

                    <div className="flex justify-between mb-2 text-[#F1F0E4]">
                      <span>Total</span>
                      <span className="font-semibold">
                        Rp {totalHarga.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <button
                      onClick={() => router.push("/user/checkout")}
                      className="w-full bg-[#A89276] hover:bg-[#BCA88D] text-white py-2.5 rounded-lg mt-5 transition"
                    >
                      Payment Method
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
