import React from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: Variant;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-200",
  secondary:
    "bg-white hover:bg-brand-50 text-brand-700 border border-brand-200",
  ghost: "bg-transparent hover:bg-brand-50 text-brand-700",
};

export const Button: React.FC<ButtonProps> = ({
  className = "",
  loading = false,
  disabled,
  variant = "primary",
  fullWidth = false,
  children,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const width = fullWidth ? "w-full" : "";
  return (
    <button
      className={`${base} ${variants[variant]} ${width} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
