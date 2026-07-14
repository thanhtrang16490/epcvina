const vndFormatter = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });
const millionFormatter = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 });

export function formatMoneyVnd(value: number) {
  return `${vndFormatter.format(Math.round(Number(value ?? 0)))} đ`;
}

export function formatMoneyMillion(value: number) {
  const amount = Number(value ?? 0);
  return `${millionFormatter.format(amount / 1_000_000)} triệu đ`;
}
