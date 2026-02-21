type TransactionItem = {
  id: string;
  name: string;
  imageUrl: string;
};

type Transaction = {
  id: string;
  status: "pending" | "success" | "canceled";
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
    <div
      className="
        bg-[#7D8D86]
        rounded-xl
        shadow-sm
        p-5
        grid
        gap-4
        md:grid-cols-4
        md:items-center
        hover:shadow-md
        transition
      "
    >
      {/* Ordr Details */}
      <div className="flex gap-4 items-center">
        {item?.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-16 h-16 text-[#F1F0E4] rounded-lg object-cover border"
          />
        )}

        <div>
          <p className="font-extrabold text-[#F1F0E4]">
            #{transaction.id.slice(0, 8)}
          </p>
          <p className="text-sm text-[#F1F0E4]">
            {new Date(transaction.createdAt).toLocaleDateString(
              "id-ID",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }
            )}
          </p>
          <p className="text-sm text-[#F1F0E4]">
            {transaction.payment_method.name}
          </p>
        </div>
      </div>

      {/* Status transaction */}
      <div className="flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            transaction.status === "pending"
              ? "bg-yellow-500"
              : transaction.status === "success"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        />
        <span className="text-sm font-medium">
          {transaction.status === "pending"
            ? "Pending"
            : transaction.status === "success"
            ? "Delivered"
            : "Cancelled"}
        </span>
      </div>

      {/* TOTAL */}
      <div className="font-semibold text-[#F1F0E4] md:text-right">
        Rp {transaction.totalAmount.toLocaleString("id-ID")}
      </div>
      <div />
    </div>
  );
}
