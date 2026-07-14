import assert from "node:assert/strict";

function parseLocaleNumber(value, fallback = 0) {
  const raw = String(value ?? "").trim().replace(/\s/g, "");
  if (!raw) return fallback;
  const normalized = raw.includes(",")
    ? raw.includes(".")
      ? raw.replace(/\./g, "").replace(/,/g, ".")
      : raw.replace(/,/g, ".")
    : raw.replace(/\./g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

assert.equal(parseLocaleNumber("5.000.000"), 5000000);
assert.equal(parseLocaleNumber("4,8"), 4.8);
assert.equal(parseLocaleNumber("1.234,56"), 1234.56);
assert.equal(parseLocaleNumber(" 12 345 "), 12345);
assert.equal(parseLocaleNumber("", 99), 99);

console.log("number-format tests passed");
