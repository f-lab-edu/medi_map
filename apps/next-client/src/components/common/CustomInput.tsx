import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface CustomInputProps {
  placeholder?: string;
  onClick?: () => void;
  variant?: "background" | "border";
  type?: "text" | "password" | "email" | "button" | "submit" | "reset";
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

export const CustomInput = ({
  placeholder = "",
  onClick,
  variant = "background",
  type = "text",
  className = "",
  value,
  onChange,
  readOnly = false,
}: CustomInputProps) => {
  const baseClass =
    "border text-custom rounded-lg py-4 px-6 w-full flex justify-center items-center gap-2";

  const variantClass = clsx({
    "bg-btn-color text-white": variant === "background",
    "border border-border-custom text-black": variant === "border",
  });

  return (
    <input
      placeholder={placeholder}
      onClick={onClick}
      type={type}
      className={twMerge(baseClass, variantClass, className)}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
  );
};