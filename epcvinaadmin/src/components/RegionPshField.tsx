"use client";

import { useMemo, useState } from "react";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { regionPresets, type AdvisorInputs } from "@/lib/system-advisor";

type Props = {
  defaultRegion: AdvisorInputs["region"];
  defaultPsh: number;
};

export function RegionPshField({ defaultRegion, defaultPsh }: Props) {
  const [region, setRegion] = useState<AdvisorInputs["region"]>(defaultRegion);
  const [psh, setPsh] = useState(String(defaultPsh));

  const regionInfo = useMemo(() => regionPresets[region], [region]);

  return (
    <div className="grid gap-2">
      <label className="text-sm text-[color:var(--muted)]">Khu vực</label>
      <select
        name="region"
        value={region}
        onChange={(event) => {
          const nextRegion = event.target.value as AdvisorInputs["region"];
          setRegion(nextRegion);
          if (nextRegion !== "custom") {
            setPsh(String(regionPresets[nextRegion].psh));
          }
        }}
        className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none"
      >
        <option value="north">Miền Bắc</option>
        <option value="central">Miền Trung</option>
        <option value="south">Miền Nam</option>
        <option value="custom">Tự nhập</option>
      </select>
      <p className="text-xs text-[color:var(--muted)]">
        {regionInfo.note} {region !== "custom" ? `PSH tự đổi sang ${regionInfo.psh.toFixed(1)}h.` : "Chọn Tự nhập để chỉnh PSH theo site thực tế."}
      </p>
      <div className="grid gap-2">
        <label className="text-sm text-[color:var(--muted)]">Giờ nắng hiệu dụng (PSH)</label>
        <FormattedNumberInput
          name="psh"
          min={0.1}
          step={0.1}
          required
          value={psh}
          onValueChange={setPsh}
          integer={false}
          inputMode="decimal"
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none"
        />
        <p className="text-xs text-[color:var(--muted)]">PSH sẽ ảnh hưởng trực tiếp đến công suất đề xuất và sản lượng dự kiến.</p>
      </div>
    </div>
  );
}
