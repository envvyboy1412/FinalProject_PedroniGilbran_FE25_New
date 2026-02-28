import { useEffect, useState } from "react";
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

  const filteredTransactions =
    statusFilter === "all"
      ? transactions
      : transactions.filter((trx) => trx.status === statusFilter);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#3E3F29]">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl text-[#F1F0E4] font-bold">
              My Transactions
            </h1>

            <div className="relative w-44">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(
                    e.target.value as
                      | "all"
                      | "pending"
                      | "success"
                      | "cancelled"
                      | "failed",
                  );
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-[#A89276] text-[#3E3F29] font-semibold px-4 py-2 rounded-lg shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F1F0E4] hover:bg-[#BCA88D] transition"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="success">Success</option>
                <option value="cancelled">Canceled</option>
                <option value="failed">Failed</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#3E3F29]">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
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
                  className="px-3 py-1 border rounded bg-[#A89276] hover:bg-[#BCA88D] disabled:opacity-40"
                >
                  &lt;
                </button>

                <span className="px-3 py-1 text-sm font-medium">
                  {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1 border rounded bg-[#A89276] hover:bg-[#BCA88D] disabled:opacity-40"
                >
                  &gt;
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