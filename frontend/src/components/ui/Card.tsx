interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}

export default function Card({ children, className = "", glow = false, hover = true }: CardProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-6
        bg-[var(--bg-card)] backdrop-blur-xl
        border border-[var(--border-subtle)]
        ${hover ? "transition-all duration-300 hover:border-[var(--border-medium)] hover:translate-y-[-2px]" : ""}
        ${glow ? "glow-primary" : ""}
        ${className}
      `}
      style={{
        background: "linear-gradient(135deg, rgba(24, 24, 27, 0.8) 0%, rgba(24, 24, 27, 0.6) 100%)",
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 50%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
