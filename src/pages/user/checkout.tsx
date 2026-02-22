import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { getPaymentMethods } from "@/services/payment.service";
import {
  createTransaction,
  getLatestPendingTransaction,
} from "@/services/transaction.service";


type CartItem = {
  id: string;
  quantity: number;
  food: {
    id: string;
    name: string;
    price: number | null;
    imageUrl: string;
  };
};

type PaymentMethod = {
  id: string;
  name: string;
};


export default function CheckoutPage() {
  useAuthGuard("user-only");
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch Cart dan Payment Method

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // CART
        const cartRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/carts`,
          {
            headers: {
              "Content-Type": "application/json",
              apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const cartJson = await cartRes.json();
        if (!cartRes.ok) throw new Error(cartJson.message);
        setCartItems(cartJson.data);

        // payment method
        const payments = await getPaymentMethods(token);
        setPaymentMethods(payments);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Total Harga
  const totalHarga = cartItems.reduce(
    (total, item) => total + (item.food.price ?? 0) * item.quantity,
    0,
  );

  //tombol checkout (API create transaction)

  const handleCheckout = async () => {
    if (!selectedPayment) {
      alert("Pilih metode pembayaran");
      return;
    }

    if (cartItems.length === 0) {
      alert("Cart kosong");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const cartIds = cartItems.map((item) => item.id);

      // buat transaksi
      await createTransaction({
        token,
        cartIds,
        paymentMethodId: selectedPayment,
      });

      const latestTransaction = await getLatestPendingTransaction(token);

      router.replace(`/user/transaction/${latestTransaction.id}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex flex-col bg-[#3E3F29]">
      <Navbar />

      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl text-[#F1F0E4] font-bold mb-6">Checkout</h1>

          {loading && <p>Loading checkout...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cart */}
              <div className="md:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-[#7D8D86]  bg-[#7D8D86] rounded-lg p-4"
                  >
                    <img
                      src={item.food.imageUrl}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold text-[#F1F0E4]">{item.food.name}</p>
                      <p className="text-sm text-[#F1F0E4]">
                        {item.quantity} × Rp{" "}
                        {(item.food.price ?? 0).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Method Payment */}
              <div className="border-[#7D8D86]  bg-[#7D8D86] rounded-lg p-4 h-fit">
                <h2 className="font-semibold mb-4 text-[#F1F0E4]">Payment Method</h2>

                <div className="space-y-2 mb-4">
                  {paymentMethods.map((pm) => (
                    <label key={pm.id} className="flex items-center text-[#F1F0E4] gap-2">
                      <input
                        type="radio"
                        className="appearance-none w-4 h-4 rounded-full checked:border-[#BCA88D] checked:bg-[#BCA88D] border-2 border-[#F1F0E4]/50"
                        checked={selectedPayment === pm.id}
                        onChange={() => setSelectedPayment(pm.id)}
                      />
                      {pm.name}
                    </label>
                  ))}
                </div>

                <div className="flex justify-between text-[#F1F0E4] mb-4 font-extrabold ">
                  <span>Total</span>
                  <span className="underline">Rp {totalHarga.toLocaleString("id-ID")}</span>
                </div>

                <button
                  disabled={submitting}
                  onClick={handleCheckout}
                  className="w-full bg-[#A89276] hover:bg-[#BCA88D] text-white py-2 rounded disabled:opacity-60"
                >
                  {submitting ? "Processing..." : "Checkout"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
