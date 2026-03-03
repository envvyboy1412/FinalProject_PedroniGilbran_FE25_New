import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import {
  adminGetAllTransactions,
  adminUpdateTransactionStatus,
} from "@/services/transaction.service";
import AdminTransactionTable from "@/components/admin/adminTransactionTable";
import { toast, Toaster } from "sonner";

type Transaction = {
  id: string;
  invoiceId: string;
  status: "pending" | "success" | "failed";
  totalAmount: number;
  proofPaymentUrl: string | null;
  createdAt: string;
  payment_method: {
    name: string;
  } | null;
};

export default function AdminTransactionPage() {
  useAuthGuard("admin-only");
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "success" | "failed"
  >("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(true);
      const data = await adminGetAllTransactions(token);
      setTransactions(data);
      setCurrentPage(1);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil transaksi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleUpdateStatus = async (
    transactionId: string,
    status: "success" | "failed"
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await adminUpdateTransactionStatus({
        token,
        transactionId,
        status,
      });

      setTransactions((prev) =>
        prev.map((trx) =>
          trx.id === transactionId ? { ...trx, status } : trx
        )
      );

      toast.success(
        status === "success"
          ? "Transaksi di-approve"
          : "Transaksi di-reject"
      );
    } catch (err: any) {
      toast.error(err.message || "Gagal update status transaksi");
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((trx) => {
        if (filterStatus === "all") return true;
        return trx.status === filterStatus;
      })
      .sort((a, b) => {
        const order = { pending: 1, success: 2, failed: 3 };
        const diff = order[a.status] - order[b.status];
        if (diff !== 0) return diff;
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      });
  }, [transactions, filterStatus]);

  const totalPages = Math.ceil(
    filteredTransactions.length / itemsPerPage
  );

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const tabClass = (status: typeof filterStatus) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition ${
      filterStatus === status
        ? "bg-[#3E3F29] text-[#F1F0E4]"
        : "bg-[#F1F0E4] text-[#3A2F24] hover:bg-opacity-80"
    }`;

  return (
    <main className="min-h-screen bg-[#3E3F29] p-4 md:p-6">
      <div className="mx-auto max-w-6xl rounded-2xl bg-[#7D8D86] p-4 md:p-6">
        <div className="mb-6 flex flex-col md:flex-row gap-3 justify-between">
          <h1 className="text-xl font-semibold text-[#F1F0E4]">
            Manajemen Transaksi
          </h1>

          <button
            onClick={() => router.push("/admin")}
            className="rounded-lg bg-[#F1F0E4] px-4 py-2 text-sm font-semibold text-[#3A2F24]"
          >
            Kembali
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={tabClass("all")}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={tabClass("pending")}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus("success")}
            className={tabClass("success")}
          >
            Success
          </button>
          <button
            onClick={() => setFilterStatus("failed")}
            className={tabClass("failed")}
          >
            Failed
          </button>
        </div>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        {loading ? (
          <p className="text-gray-200">Loading...</p>
        ) : paginatedTransactions.length === 0 ? (
          <p className="text-gray-200">Belum ada transaksi.</p>
        ) : (
          <>
            <AdminTransactionTable
              transactions={paginatedTransactions}
              onUpdateStatus={handleUpdateStatus}
            />

            <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-[#F1F0E4]">
              <p>
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1 rounded-lg bg-[#F1F0E4] text-black disabled:opacity-40"
                >
                  ‹
                </button>

                <div className="px-4 py-1 rounded-lg bg-[#3E3F29]">
                  {currentPage}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1 rounded-lg bg-[#F1F0E4] text-black disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <Toaster position="top-right" richColors />
    </main>
  );
}