import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  className = "",
  ...props
}) => {
  const inputId = id || props.name || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="relative">
      <input
        id={inputId}
        placeholder=" "
        className={`peer w-full px-4 py-3 border-2 border-brand-200 rounded-xl focus:outline-none focus:border-brand-500 transition bg-white text-brand-900 placeholder-transparent ${className}`}
        {...props}
      />
      <label
        htmlFor={inputId}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-brand-700 transition-all pointer-events-none
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-500
                  peer-focus:-top-3 peer-focus:text-xs peer-focus:text-brand-700 peer-focus:px-1 peer-focus:bg-white
                  peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs"
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
