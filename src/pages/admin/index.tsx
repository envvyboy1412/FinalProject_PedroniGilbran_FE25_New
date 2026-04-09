import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function AdminPage() {
  useAuthGuard("admin-only");
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/foods");
  }, []);

  return null;
}