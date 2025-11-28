import React from "react";

type Variant = "error" | "success" | "warning" | "info";

const variantStyles: Record<Variant, string> = {
  error: "bg-red-50 text-red-700 border-red-200",
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  className = "",
  children,
  ...props
}) => {
  return (
    <div
      className={`border rounded-xl px-4 py-3 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Alert;
