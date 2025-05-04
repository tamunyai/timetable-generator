import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  to?: string;
  label?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  to,
  label = "Get Started",
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  const baseStyles =
    "inline-flex justify-center items-center bg-background hover:bg-gray-100 disabled:opacity-50 px-4 py-2 border border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background ring-offset-background focus-visible:ring-offset-2 h-10 font-medium text-sm whitespace-nowrap transition-colors hover:text-accent-foreground hover:cursor-pointer disabled:pointer-events-none";

  if (to) {
    return (
      <Link
        to={to}
        className={`${baseStyles} ${className}`}
        aria-disabled={disabled}
      >
        {label}
      </Link>
    );
  }

  return (
      <button
        type={type}
        onClick={onClick}
        className={`${baseStyles} ${className} disabled:hover:bg-background disabled:text-gray-400`}
        disabled={disabled}
        aria-disabled={disabled}
      >
        {label}
      </button>
  );
};
