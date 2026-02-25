import { useEffect, useState } from "react";
import { adminCreateFood, adminUpdateFood } from "@/services/food.service";
import { uploadImage } from "@/services/auth.service";

type Props = {
  mode?: "create" | "edit";
  foodId?: string;
  initialData?: {
    name: string;
    description: string;
    ingredients: string[];
    price: number;
    imageUrl: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
};

export default function FoodForm({
  mode = "create",
  foodId,
  initialData,
  onSuccess,
  onCancel,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // untuk modal edit(update)
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setIngredients(initialData.ingredients.join(", "));
      setPrice(String(initialData.price));
      setPreview(initialData.imageUrl);
    }
  }, [mode, initialData]);

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !price) {
      setError("Semua field wajib diisi");
      return;
    }

    if (mode === "create" && !image) {
      setError("Gambar wajib diisi");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(true);
      setError("");

      let imageUrl = initialData?.imageUrl || "";

      // Buat update gambar, jika gambar baru
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const payload = {
        name,
        description,
        ingredients: ingredients.split(",").map((item) => item.trim()),
        price: Number(price),
        imageUrl,
      };

      if (mode === "edit" && foodId) {
        await adminUpdateFood(foodId, payload, { token });
      } else {
        await adminCreateFood(payload, { token });
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3E3F29]/90">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl text-[#F1F0E4] bg-[#7D8D86] p-6 shadow-lg"
      >
        <h2 className="mb-4 text-lg font-semibold">
          {mode === "edit" ? "Edit Food" : "Tambah Food"}
        </h2>

        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        {/* Nama Food */}
        <div className="mb-3">
          <label className="mb-1 block text-sm ">Nama</label>
          <input
            type="text"
            placeholder="Nama Makanan"
            className="w-full rounded  px-3 py-2 bg-[#F1F0E4] text-[#BCA88D] font-semibold"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Deskripsi */}
        <div className="mb-3">
          <label className="mb-1 block text-sm">Deskripsi</label>
          <textarea
            className="w-full rounded border px-3 py-2 bg-[#F1F0E4] text-[#BCA88D] font-semibold"
            placeholder="Deskripsi Makanan"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Ingredients */}
        <div className="mb-3">
          <label className="mb-1 block text-sm">
            Ingredients (pisahkan dengan koma)
          </label>
          <input
            type="text"
            placeholder="Ingredients"
            className="w-full rounded border px-3 py-2 bg-[#F1F0E4] text-[#BCA88D] font-semibold"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>

        {/* Harga */}
        <div className="mb-3">
          <label className="mb-1 block text-sm">Harga</label>
          <input
            type="number"
            placeholder="Harga"
            className="w-full rounded border px-3 py-2 bg-[#F1F0E4] text-[#BCA88D] font-semibold"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Gambar */}
        <div className="mb-4">
          <label className="mb-2 block text-sm">
            Tambah Gambar {mode === "edit" && "(opsional)"}
          </label>

          <label
            htmlFor="image"
            className="flex h-40 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <div className="text-center text-sm text-gray-500">
                <p className="font-medium">Upload gambar</p>
                <p className="text-xs">PNG, JPG, JPEG</p>
              </div>
            )}
          </label>

          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>
        {/* Action */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700 active:scale-95 active:bg-red-800 active:shadow-inner"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded bg-green-600 px-4 py-2 text-sm text-white transition hover:bg-green-700 active:scale-95 active:bg-green-800 active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
