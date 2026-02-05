interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const baseStyles = `
  relative overflow-hidden font-medium transition-all duration-200
  disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
  active:scale-[0.98]
`;

const variants = {
  primary: `
    bg-gradient-to-r from-[#a78bfa] to-[#818cf8] text-white
    hover:shadow-[0_0_24px_rgba(167,139,250,0.4)]
    hover:translate-y-[-1px]
  `,
  secondary: `
    bg-[var(--bg-elevated)] text-[var(--text-primary)]
    border border-[var(--border-medium)]
    hover:bg-[var(--bg-card)] hover:border-[var(--accent-primary)]
  `,
  danger: `
    bg-[var(--accent-loss-soft)] text-[var(--accent-loss)]
    border border-transparent
    hover:bg-[var(--accent-loss)] hover:text-white
    hover:shadow-[0_0_20px_rgba(255,107,107,0.3)]
  `,
  ghost: `
    bg-transparent text-[var(--text-secondary)]
    hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]
  `,
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3 text-base rounded-xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* Shimmer effect on primary buttons */}
      {variant === "primary" && (
        <span
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            transform: "translateX(-100%)",
            animation: "shimmer-btn 2s infinite",
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
