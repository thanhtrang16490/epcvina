"use client";

import { useMemo, useState } from "react";
import { type AdvisorInputs } from "@/lib/system-advisor";

type Props = {
  defaultCustomerType: AdvisorInputs["customerType"];
  defaultPhase: AdvisorInputs["phase"];
};

function phaseLabel(phase: AdvisorInputs["phase"]) {
  return phase === 3 ? "Ưu tiên 3 pha cho cả nhà" : "Ưu tiên 1 pha riêng";
}

export function CustomerTypePhaseField({ defaultCustomerType, defaultPhase }: Props) {
  const [customerType, setCustomerType] = useState<AdvisorInputs["customerType"]>(defaultCustomerType);
  const [phase, setPhase] = useState<AdvisorInputs["phase"]>(defaultPhase ?? (defaultCustomerType === "commercial" ? 3 : 1));

  const phaseNote = useMemo(() => {
    if (phase === 3) {
      return "Nhà dân dụng có điều hòa tổng hoặc thang máy thường dùng 3 pha cho cả nhà.";
    }
    return "Chọn 1 pha để chạy riêng cho các thiết bị khác của nhà.";
  }, [phase]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm text-[color:var(--muted)]">Loại khách hàng</label>
        <select
          name="customer_type"
          value={customerType}
          onChange={(event) => {
            const next = event.target.value as AdvisorInputs["customerType"];
            setCustomerType(next);
            setPhase(next === "commercial" ? 3 : 1);
          }}
          required
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none"
        >
          <option value="residential">Sinh hoạt</option>
          <option value="commercial">Kinh doanh</option>
        </select>
        <p className="text-xs text-[color:var(--muted)]">
          Kinh doanh sẽ ưu tiên 3 pha; sinh hoạt mặc định 1 pha để dễ tư vấn nhanh.
        </p>
      </div>

      <div className="grid gap-2">
        <label className="text-sm text-[color:var(--muted)]">Điện áp hệ thống</label>
        <select
          name="phase"
          value={phase}
          onChange={(event) => setPhase(Number(event.target.value) === 1 ? 1 : 3)}
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none"
        >
          <option value={1}>1 pha</option>
          <option value={3}>3 pha</option>
        </select>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1 text-xs font-medium text-[color:var(--text)]">
            {phaseLabel(phase)}
          </span>
          <span className="text-xs text-[color:var(--muted)]">{phaseNote}</span>
        </div>
      </div>
    </div>
  );
}
