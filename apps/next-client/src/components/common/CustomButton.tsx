import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "background" | "border";
  type?: "button" | "submit" | "reset";
  className?: string;  
}

export const CustomButton = ({
  children,
  onClick,
  variant = "background",
  type = "button",
  className = "",
}: CustomButtonProps) => {
  const baseClass =
    "border rounded-lg py-4 px-6 w-full flex justify-center items-center gap-2 cursor-pointer";

  const variantClass = clsx({
    "bg-btn-color text-white": variant === "background",
    "border border-border-custom text-black": variant === "border",
  });

  return (
    <button
      onClick={onClick}
      type={type}
      className={twMerge(baseClass, variantClass, className)}
    >
      {children}
    </button>
  );
};
