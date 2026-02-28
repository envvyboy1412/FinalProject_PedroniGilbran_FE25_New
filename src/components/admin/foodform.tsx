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
        className="w-full max-w-md mx-4 rounded-xl bg-[#7D8D86] p-6 text-[#F1F0E4]"
      >
        <h2 className="mb-4 text-lg font-semibold">
          {mode === "edit" ? "Edit Food" : "Tambah Food"}
        </h2>

        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        <input
          className="w-full mb-3 rounded px-3 py-2 bg-[#F1F0E4] text-[#BCA88D]"
          placeholder="Nama Makanan"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full mb-3 rounded px-3 py-2 bg-[#F1F0E4] text-[#BCA88D]"
          placeholder="Deskripsi"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="w-full mb-3 rounded px-3 py-2 bg-[#F1F0E4] text-[#BCA88D]"
          placeholder="Ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />

        <input
          type="number"
          className="w-full mb-3 rounded px-3 py-2 bg-[#F1F0E4] text-[#BCA88D]"
          placeholder="Harga"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label className="block mb-4 cursor-pointer">
          <div className="h-40 rounded-lg border-2 border-dashed bg-gray-50 flex items-center justify-center">
            {preview ? (
              <img src={preview} className="h-full w-full object-cover rounded-lg" />
            ) : (
              <span className="text-gray-500 text-sm">Upload Gambar</span>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}