import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { getMyTransactions } from "@/services/transaction.service";
import { TransactionCard } from "@/components/transaction/transactioncard";

type Transaction = {
  id: string;
  invoiceId: string;
  status: "pending" | "success" | "cancelled" | "failed";
  totalAmount: number;
  createdAt: string;
  payment_method: {
    name: string;
  };
  transaction_items: any[];
};

export default function HistoryPage() {
  useAuthGuard("user-only");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "success" | "cancelled" | "failed"
  >("all");

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    return statusFilter === "all"
      ? transactions
      : transactions.filter((trx) => trx.status === statusFilter);
  }, [transactions, statusFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const paginatedTransactions = useMemo(() => {
    return filteredTransactions.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
  }, [filteredTransactions, currentPage]);

  const loadTransactions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const data = await getMyTransactions(token);

    const sorted = [...data].sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setTransactions(sorted);
    setLoading(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const tabClass = (status: typeof statusFilter) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition ${
      statusFilter === status
        ? "bg-[#3E3F29] text-[#F1F0E4]"
        : "bg-[#F1F0E4] text-[#3A2F24] hover:bg-opacity-80"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-[#3E3F29]">
      <Navbar />

      <main className="flex-1 m-8">
        <div className="max-w-6xl mx-auto rounded-2xl px-6 py-8  bg-[#7D8D86]">
          <div className="mb-6 flex flex-col md:flex-row gap-3 justify-between ">
            <h1 className="text-2xl text-[#F1F0E4] font-bold">
              My Transactions
            </h1>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={tabClass("all")}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={tabClass("pending")}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("success")}
              className={tabClass("success")}
            >
              Success
            </button>
            <button
              onClick={() => setStatusFilter("cancelled")}
              className={tabClass("cancelled")}
            >
              Cancelled
            </button>
            <button
              onClick={() => setStatusFilter("failed")}
              className={tabClass("failed")}
            >
              Failed
            </button>
          </div>

          <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_auto] text-sm font-bold text-[#F1F0E4] mb-3 px-6">
            <span>ORDER DETAILS</span>
            <span>STATUS</span>
            <span className="text-right">HARGA</span>
            <span />
          </div>

          {!loading && (
            <div className="space-y-4">
              {paginatedTransactions.map((trx) => (
                <TransactionCard key={trx.id} transaction={trx} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-8">
              <p className="text-sm text-[#F1F0E4]">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredTransactions.length,
                )}{" "}
                of {filteredTransactions.length}
              </p>

              <div className="flex gap-2 text-[#F1F0E4] items-center">
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
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}