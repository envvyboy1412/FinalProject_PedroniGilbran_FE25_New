import Picture from "@/components/pictures";

type TransactionItem = {
  id: string;
  name: string;
  imageUrl: string;
};

type Transaction = {
  id: string;
  invoiceId: string;
  status: "pending" | "success" | "cancelled" | "failed";
  totalAmount: number;
  createdAt: string;
  payment_method: {
    name: string;
  };
  transaction_items: TransactionItem[];
};

type Props = {
  transaction: Transaction;
};

export function TransactionCard({ transaction }: Props) {
  const item = transaction.transaction_items?.[0];

  return (
    <div className="bg-[#F1F0E4] rounded-xl shadow-sm p-5 grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto] md:items-center hover:shadow-md transition">
      <div className="flex gap-4 items-center">
        <Picture
          src={item?.imageUrl}
          alt={item?.name}
          className="w-16 h-16  rounded-lg object-cover border"
        />

        <div>
          <p className="font-sans text-[#7D8D86]">
            {transaction.invoiceId}
          </p>
          <p className="text-sm text-[#7D8D86]">
            {new Date(transaction.createdAt).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="text-sm text-[#7D8D86]">
            {transaction.payment_method.name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            transaction.status === "pending"
              ? "bg-yellow-500"
              : transaction.status === "success"
                ? "bg-green-500"
                : transaction.status === "failed"
                  ? "bg-red-600"
                  : "bg-red-700"
          }`}
        />
        <span className="text-sm font-medium">
          {transaction.status === "pending"
            ? "Pending"
            : transaction.status === "success"
              ? "Success"
              : transaction.status === "failed"
                ? "Failed"
                : "Cancelled"}
        </span>
      </div>

      <div className="font-bold text-[#7D8D86]  md:text-right">
        Rp {transaction.totalAmount.toLocaleString("id-ID")}
      </div>
      <div />
    </div>
  );
}