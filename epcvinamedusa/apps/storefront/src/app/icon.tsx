export default function Icon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#0f172a" />
      <circle cx="32" cy="32" r="16" fill="url(#g)" />
      <path
        d="M32 10v8M32 46v8M10 32h8M46 32h8M18 18l6 6M40 40l6 6M46 18l-6 6M24 40l-6 6"
        stroke="#fde68a"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
