"use client";

import { useRouter } from "next/navigation";
import { ThemeButton } from "@/components/ui/ThemeButton";

export function RefreshDashboardButton() {
  const router = useRouter();

  return (
    <ThemeButton type="button" onClick={() => router.refresh()} tone="secondary">
      Làm mới dữ liệu
    </ThemeButton>
  );
}
