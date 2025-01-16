import React from "react";

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "background" | "border";
  type?: "button" | "submit" | "reset";
}

export const CustomButton = ({
  children,
  onClick,
  variant = "background",
  type = "button",
}: CustomButtonProps) => {
  const baseClass =
    "border text-custom rounded-lg py-4 px-6 w-full flex justify-center items-center gap-2 cursor-pointer";

    const variantClass =
    variant === "background"
      ? "bg-btn-color text-white login_button"
      : "border border-border-custom text-black social_button";  

  return (
    <button
      onClick={onClick}
      type={type}
      className={`${baseClass} ${variantClass}`}
    >
      {children}
    </button>
  );
};