const vndFormatter = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });
const millionFormatter = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 });

function roundToThousand(value: number) {
  return Math.round(Number(value ?? 0) / 1000) * 1000;
}

export function formatMoneyVnd(value: number) {
  return `${vndFormatter.format(roundToThousand(value))} đ`;
}

export function formatMoneyMillion(value: number) {
  const amount = Number(value ?? 0);
  return `${millionFormatter.format(amount / 1_000_000)} triệu đ`;
}
