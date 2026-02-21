import { useRouter } from "next/router";
import { useEffect } from "react";

type Role = "user" | "admin";
type GuardMode = "user-only" | "admin-only";

export function useAuthGuard(mode?: GuardMode) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as Role | null;

    // Jika Belum Login
    if (!token || !role) {
      router.replace("/login");
      return;
    }

    // Untuk Protect Admin Only Yang Bisa Akses
    if (mode === "admin-only" && role !== "admin") {
      router.replace("/user");
      return;
    }

    // Untuk Protect User Only Yang Bisa Akses
    if (mode === "user-only" && role !== "user") {
      router.replace("/user");
      return;
    }
  }, [router, mode]);
}
