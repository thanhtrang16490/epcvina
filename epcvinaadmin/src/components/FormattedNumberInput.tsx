"use client";

import { useEffect, useMemo, useState } from "react";

type FormattedNumberInputProps = {
  name: string;
  defaultValue?: number | string | null;
  value?: number | string | null;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  className?: string;
  placeholder?: string;
  integer?: boolean;
  inputMode?: "numeric" | "decimal";
  onValueChange?: (value: string) => void;
};

function normalizeValue(value: number | string | null | undefined, integer: boolean) {
  if (value === null || value === undefined || value === "") return "";
  const raw = String(value).replace(/[,\s]/g, "");
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return "";
  return integer ? String(Math.round(parsed)) : String(parsed);
}

function formatValue(value: string, integer: boolean) {
  const normalized = value.replace(/[,\s]/g, "");
  if (!normalized) return "";
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return "";
  return integer
    ? new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(Math.round(parsed))
    : new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(parsed);
}

function sanitizeValue(value: string, integer: boolean) {
  const cleaned = value.replace(/[^\d,.-]/g, "").replace(/,/g, "");
  if (!cleaned) return "";
  if (integer) {
    const parsed = Number(cleaned.replace(/\./g, ""));
    return Number.isFinite(parsed) ? String(Math.trunc(parsed)) : "";
  }
  const normalized = cleaned.match(/^-?\d*(?:\.\d*)?/)?.[0] ?? "";
  if (!normalized || normalized === "-" || normalized === "." || normalized === "-.") return normalized;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? normalized : "";
}

export function FormattedNumberInput({
  defaultValue,
  value,
  className,
  integer = true,
  onValueChange,
  ...props
}: FormattedNumberInputProps) {
  const normalizedDefault = useMemo(() => normalizeValue(value ?? defaultValue, integer), [value, defaultValue, integer]);
  const [innerValue, setInnerValue] = useState(normalizedDefault);
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    setInnerValue(normalizedDefault);
  }, [normalizedDefault]);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? normalizedDefault : innerValue;
  const displayValue = isFocused ? currentValue : formatValue(currentValue, integer) || currentValue;

  return (
    <input
      {...props}
      type="text"
      inputMode={props.inputMode ?? (integer ? "numeric" : "decimal")}
      value={displayValue}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onChange={(event) => {
        const next = sanitizeValue(event.target.value, integer);
        if (!isControlled) setInnerValue(next);
        onValueChange?.(next);
      }}
      className={className}
    />
  );
}
