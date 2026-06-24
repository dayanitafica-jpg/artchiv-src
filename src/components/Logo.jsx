export default function Logo({ size = 28, color = '#ffffff' }) {
  // Isotipo de artChiv: dos trazos en zigzag que sugieren una "A" y una "V"
  // entrelazadas, coronados por un punto — geometría simplificada y propia,
  // no una reproducción del lockup fotográfico original.
  return (
    <svg
      width={size}
      height={size * 1.05}
      viewBox="0 0 100 105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="artChiv"
    >
      <circle cx="38" cy="14" r="9" fill={color} />
      <path
        d="M30 28 L50 28 L78 62 L60 62 L40 38 L20 62 L2 62 Z"
        fill={color}
      />
      <path
        d="M18 66 L36 66 L52 86 L34 86 L18 66 Z"
        fill={color}
      />
    </svg>
  );
}
