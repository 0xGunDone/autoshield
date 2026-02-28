type Props = {
  className?: string;
  title?: string;
};

export function ShieldLogo({ className, title = "АВТО69" }: Props) {
  return (
    <svg viewBox="0 0 100 110" className={className} role="img" aria-label={title}>
      <defs>
        <linearGradient id="shieldFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="58%" stopColor="#a5f3fc" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
        <linearGradient id="shieldStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
      </defs>

      <path
        d="M50 5 L89 20 V52 C89 76 74 94 50 105 C26 94 11 76 11 52 V20 Z"
        fill="url(#shieldFill)"
        stroke="url(#shieldStroke)"
        strokeWidth="4"
      />
      <path
        d="M50 14 L81 26 V50 C81 69 69 84 50 94 C31 84 19 69 19 50 V26 Z"
        fill="rgba(255,255,255,0.58)"
        stroke="rgba(2,132,199,0.5)"
        strokeWidth="1.6"
      />

      <text
        x="50"
        y="45"
        textAnchor="middle"
        fontSize="16"
        fontWeight="800"
        fill="#0c4a6e"
        style={{ fontFamily: "var(--font-display), sans-serif", letterSpacing: "1px" }}
      >
        АВТО
      </text>
      <text
        x="50"
        y="70"
        textAnchor="middle"
        fontSize="24"
        fontWeight="900"
        fill="#065f46"
        style={{ fontFamily: "var(--font-display), sans-serif", letterSpacing: "0.6px" }}
      >
        69
      </text>
    </svg>
  );
}
