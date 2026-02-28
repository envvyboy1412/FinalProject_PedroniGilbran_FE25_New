import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import {
  getTransactionById,
  cancelTransaction,
  updateTransactionProof,
} from "@/services/transaction.service";
import { uploadImage } from "@/services/auth.service";

type TransactionItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  imageUrl: string;
};

type Transaction = {
  id: string;
  status: "pending" | "success" | "canceled";
  totalAmount: number;
  proofPaymentUrl: string | null;
  payment_method: {
    name: string;
    virtualAccountNumber: string;
  };
  transaction_items: TransactionItem[];
};

export default function TransactionDetailPage() {
  useAuthGuard("user-only");
  const router = useRouter();
  const { id } = router.query;

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const fetchTransaction = async () => {
    try {
      if (!id) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      const data = await getTransactionById({
        token,
        transactionId: id as string,
      });

      setTransaction(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const handleUpload = async () => {
    if (!proofFile || !transaction) return;

    try {
      setUploading(true);

      const token = localStorage.getItem("token");
      if (!token) return;

      const imageUrl = await uploadImage(proofFile);

      await updateTransactionProof({
        token,
        transactionId: transaction.id,
        imageUrl,
      });

      toast.success("Bukti pembayaran berhasil diupload");
      setRedirecting(true);
      setTimeout(() => {
        router.replace("/user");
      }, 3000);
      setProofFile(null);
      fetchTransaction();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    if (!transaction) return;

    toast("Batalkan transaksi?", {
      description: "Transaksi yang dibatalkan tidak bisa dikembalikan.",
      action: {
        label: "Ya, Batalkan",
        onClick: async () => {
          try {
            const token = localStorage.getItem("token");
            if (!token) return;

            setRedirecting(true);

            await cancelTransaction({
              token,
              transactionId: transaction.id,
            });

            toast.success("Transaksi dibatalkan");

            setTimeout(() => {
              router.replace("/user");
            }, 3000);
          } catch (err: any) {
            setRedirecting(false);
            toast.error(err.message);
          }
        },
      },
      cancel: {
        label: "Batal",
        onClick: () => {},
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#3E3F29]">
      <Navbar />
      <Toaster richColors position="top-center" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl text-[#F1F0E4] font-bold mb-6">
            Transaction Detail
          </h1>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && transaction && (
            <>
              <div className="bg-[#7D8D86] text-[#F1F0E4] rounded-lg p-4 mb-6">
                <p>
                  Status: <strong>{transaction.status.toUpperCase()}</strong>
                </p>
                <p>Payment: {transaction.payment_method.name}</p>
                <p>VA: {transaction.payment_method.virtualAccountNumber}</p>
                <p>
                  <p>
                    Harga: Rp {transaction.totalAmount.toLocaleString("id-ID")}
                  </p>
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {transaction.transaction_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 text-[#F1F0E4] bg-[#7D8D86] p-3 rounded"
                  >
                    <img src={item.imageUrl} className="w-16 h-16 rounded" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm">Jumlah: {item.quantity} item</p>
                    </div>
                  </div>
                ))}
              </div>

              {transaction.status === "pending" && (
                <>
                  <input
                    id="proof"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />

                  <label
                    htmlFor="proof"
                    className="inline-block cursor-pointer bg-[#A89276] hover:bg-[#BCA88D] text-white px-4 py-2 rounded"
                  >
                    {proofFile
                      ? "Ganti Bukti Pembayaran"
                      : "Pilih Bukti Pembayaran"}
                  </label>

                  {proofFile && (
                    <div className="mt-4">
                      <p className="text-sm text-[#F1F0E4] mb-2">
                        Preview Bukti Pembayaran:
                      </p>
                      <img
                        src={URL.createObjectURL(proofFile)}
                        alt="Preview bukti pembayaran"
                        className="w-40 h-40 object-cover rounded border border-[#A89276]"
                      />
                    </div>
                  )}

                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={handleUpload}
                      disabled={!proofFile || uploading}
                      className="bg-[#A89276] hover:bg-[#BCA88D] text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                      {uploading ? "Uploading..." : "Upload Proof"}
                    </button>

                    <button
                      onClick={handleCancel}
                      className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                  {redirecting && (
                    <div className="fixed inset-0 bg-white/60 z-50 flex items-center justify-center">
                      <div className="text-white text-lg font-semibold animate-pulse">
                        Mengalihkan halaman...
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
