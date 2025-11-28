import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className = "",
  padded = true,
  children,
  ...props
}) => {
  const padding = padded ? "p-6 sm:p-8" : "";
  return (
    <div
      className={`bg-white rounded-2xl shadow-xl shadow-brand-100/60 border border-brand-100 ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
