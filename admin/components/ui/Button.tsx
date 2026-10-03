import React, { ComponentPropsWithoutRef, ElementType } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[var(--primary)] hover:opacity-90 text-[var(--primary-text,#ffffff)] shadow-2xs",
  secondary: "bg-[var(--surface-muted)] hover:bg-[var(--surface-hover,var(--surface))] text-[var(--text)] border border-[var(--border)] shadow-2xs",
  outline: "bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--text)] border border-[var(--border)]",
  ghost: "bg-transparent hover:bg-[var(--surface-muted)] text-[var(--text-muted)] border",
  danger: "bg-[var(--surface)] hover:bg-red-300 text-red-600 border border-red-400 hover:border-red-600",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-1 py-1 text-xs rounded-lg gap-0.5",
  md: "px-2 py-1.5 text-sm rounded-lg gap-1",
  lg: "px-3.5 py-2 text-base rounded-lg gap-1.5",
};

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ElementType;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  fullWidth = false,
  className = "",
  onClick,
  disabled = false,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-colors focus:shadow-2xl ${
        disabled
          ? " text-[var(--text-muted)] cursor-not-allowed"
          : "cursor-pointer"
      } ${
        variantStyles[variant] || variantStyles.primary
      } ${sizeStyles[size] || sizeStyles.md} ${
        fullWidth ? "w-full flex-1" : ""
      } ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
};

export default Button;