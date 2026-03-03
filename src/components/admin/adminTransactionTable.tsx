import { useState } from "react";

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

type Props = {
  transactions: Transaction[];
  onUpdateStatus: (
    transactionId: string,
    status: "success" | "failed"
  ) => Promise<void> | void;
};

export default function AdminTransactionTable({
  transactions,
  onUpdateStatus,
}: Props) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [actionLoading, setActionLoading] = useState<
    "success" | "failed" | null
  >(null);

  return (
    <>
      <div className="block md:hidden space-y-4">
        {transactions.map((trx) => (
          <div
            key={trx.id}
            className="rounded-xl bg-[#3E3F29] p-4 text-[#F1F0E4]"
          >
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{trx.invoiceId}</p>
              <p>{trx.payment_method?.name || "-"}</p>
              <p>
                Rp {trx.totalAmount.toLocaleString("id-ID")}
              </p>
              <span
                className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                  trx.status === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : trx.status === "success"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {trx.status}
              </span>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                onClick={() => setSelectedTransaction(trx)}
                className="rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700"
              >
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left font-medium">
                Invoice
              </th>
              <th className="px-5 py-3 text-left font-medium">
                Metode
              </th>
              <th className="px-5 py-3 text-left font-medium">
                Total
              </th>
              <th className="px-5 py-3 text-left font-medium">
                Status
              </th>
              <th className="px-5 py-3 text-center font-medium">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {transactions.map((trx) => (
              <tr key={trx.id}>
                <td className="px-5 py-4 font-medium text-[#F1F0E4]">
                  {trx.invoiceId}
                </td>

                <td className="px-5 py-4 text-[#F1F0E4]">
                  {trx.payment_method?.name || "-"}
                </td>

                <td className="px-5 py-4 text-[#F1F0E4]">
                  Rp {trx.totalAmount.toLocaleString("id-ID")}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded px-2 py-1 text-xs font-semibold ${
                      trx.status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : trx.status === "success"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {trx.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-center">
                  <button
                    onClick={() => setSelectedTransaction(trx)}
                    className="rounded-lg bg-blue-100 px-3 py-1 text-blue-700"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3E3F29]/90">
          <div className="w-full max-w-md mx-4 rounded-xl bg-[#7D8D86] p-6 text-[#F1F0E4]">
            <h2 className="mb-4 text-lg font-semibold">
              Detail Transaksi
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <b>Invoice:</b> {selectedTransaction.invoiceId}
              </p>
              <p>
                <b>Metode:</b>{" "}
                {selectedTransaction.payment_method?.name || "-"}
              </p>
              <p>
                <b>Total:</b> Rp{" "}
                {selectedTransaction.totalAmount.toLocaleString(
                  "id-ID"
                )}
              </p>
              <p>
                <b>Status:</b> {selectedTransaction.status}
              </p>
            </div>

            <div className="my-4">
              {selectedTransaction.proofPaymentUrl ? (
                <img
                  src={selectedTransaction.proofPaymentUrl}
                  className="h-48 w-full rounded-lg object-cover"
                />
              ) : (
                <p className="text-sm text-gray-300">
                  Belum ada bukti pembayaran
                </p>
              )}
            </div>

            {selectedTransaction.status === "pending" && (
              <div className="mb-3 flex gap-2">
                <button
                  disabled={actionLoading !== null}
                  onClick={async () => {
                    setActionLoading("success");
                    await onUpdateStatus(
                      selectedTransaction.id,
                      "success"
                    );
                    setTimeout(() => {
                      setActionLoading(null);
                      setSelectedTransaction(null);
                    }, 2000);
                  }}
                  className={`flex-1 rounded py-2 text-sm text-white ${
                    actionLoading === "success"
                      ? "bg-green-700"
                      : "bg-green-600 hover:bg-green-700"
                  } ${
                    actionLoading &&
                    actionLoading !== "success" &&
                    "opacity-40"
                  }`}
                >
                  {actionLoading === "success"
                    ? "Memproses..."
                    : "Approve"}
                </button>

                <button
                  disabled={actionLoading !== null}
                  onClick={async () => {
                    setActionLoading("failed");
                    await onUpdateStatus(
                      selectedTransaction.id,
                      "failed"
                    );
                    setTimeout(() => {
                      setActionLoading(null);
                      setSelectedTransaction(null);
                    }, 2000);
                  }}
                  className={`flex-1 rounded py-2 text-sm text-white ${
                    actionLoading === "failed"
                      ? "bg-red-700"
                      : "bg-red-600 hover:bg-red-700"
                  } ${
                    actionLoading &&
                    actionLoading !== "failed" &&
                    "opacity-40"
                  }`}
                >
                  {actionLoading === "failed"
                    ? "Memproses..."
                    : "Reject"}
                </button>
              </div>
            )}

            <button
              disabled={actionLoading !== null}
              onClick={() => setSelectedTransaction(null)}
              className="w-full rounded bg-gray-400 py-2 text-sm text-white disabled:opacity-40"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}