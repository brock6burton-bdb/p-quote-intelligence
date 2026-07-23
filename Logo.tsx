type LogoProps = {
  compact?: boolean;
  inverse?: boolean;
};

export default function Logo({ compact = false, inverse = false }: LogoProps) {
  const ink = inverse ? "#ffffff" : "#171717";
  const soft = inverse ? "#d9d9d9" : "#b8b8b8";

  return (
    <div className="logo-lockup" aria-label="Prism">
      <svg
        className="logo-mark"
        width="38"
        height="38"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M13 11L45 32L13 53V11Z" fill={ink} />
        <path d="M45 32L54 38V52L34 39L45 32Z" fill={soft} />
      </svg>

      {!compact && (
        <span className="logo-word" style={{ color: ink }}>
          PRISM
        </span>
      )}
    </div>
  );
}
