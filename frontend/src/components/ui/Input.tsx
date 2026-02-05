interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-xl text-sm
          bg-[var(--bg-elevated)] text-[var(--text-primary)]
          border border-[var(--border-subtle)]
          placeholder:text-[var(--text-muted)]
          transition-all duration-200
          focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary-soft)]
          focus:outline-none
          hover:border-[var(--border-medium)]
          ${error ? "border-[var(--accent-loss)] focus:border-[var(--accent-loss)] focus:ring-[var(--accent-loss-soft)]" : ""}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-[var(--accent-loss)] flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
