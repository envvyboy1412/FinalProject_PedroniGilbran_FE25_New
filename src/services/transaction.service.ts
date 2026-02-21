const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;

const authHeaders = (token: string) => ({
  apiKey: API_KEY,
  Authorization: `Bearer ${token}`,
});

// Create Transaction API

export async function createTransaction(params: {
  token: string;
  cartIds: string[];
  paymentMethodId: string;
}) {
  const res = await fetch(`${BASE_URL}/api/v1/create-transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(params.token),
    },
    body: JSON.stringify({
      cartIds: params.cartIds,
      paymentMethodId: params.paymentMethodId,
    }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json?.errors?.[0]?.message ||
        json?.message ||
        "Gagal membuat transaksi"
    );
  }

  return json;
}

//Get My Transaction API

export async function getMyTransactions(token: string) {
  const res = await fetch(`${BASE_URL}/api/v1/my-transactions`, {
    headers: authHeaders(token),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil transaksi user");
  }

  return json.data;
}

// Sortir Trasanction 

export async function getLatestPendingTransaction(token: string) {
  const transactions = await getMyTransactions(token);

  const pending = transactions
    .filter(
      (trx: any) => trx.status?.toLowerCase() === "pending"
    )
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

  if (pending.length === 0) {
    throw new Error("Tidak ada transaksi pending");
  }

  return pending[0];
}

// Get Transation By ID API

export async function getTransactionById(params: {
  token: string;
  transactionId: string;
}) {
  const res = await fetch(
    `${BASE_URL}/api/v1/transaction/${params.transactionId}`,
    {
      headers: authHeaders(params.token),
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil detail transaksi");
  }

  return json.data;
}

// Upload Proof Transaction API

export async function uploadTransactionProof(params: {
  token: string;
  transactionId: string;
  file: File;
}) {
  const formData = new FormData();
  formData.append("image", params.file);

  const res = await fetch(
    `${BASE_URL}/api/v1/update-transaction-proof-payment/${params.transactionId}`,
    {
      method: "POST",
      headers: authHeaders(params.token),
      body: formData,
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Upload bukti gagal");
  }

  return json;
}

// Cancel Transaction API

export async function cancelTransaction(params: {
  token: string;
  transactionId: string;
}) {
  const res = await fetch(
    `${BASE_URL}/api/v1/cancel-transaction/${params.transactionId}`,
    {
      method: "POST",
      headers: authHeaders(params.token),
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Gagal membatalkan transaksi");
  }

  return json;
}