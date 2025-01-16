import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import React from "react";

const buttonVariants = cva(
  "rounded-lg flex justify-center items-center gap-2 cursor-pointer",
  {
    variants: {
      variant: {
        background: "bg-btn-color text-white",
        border: "border border-border-custom text-black",
      },
      size: {
        small: "py-2 px-4 bg-btn-color text-white",
        large: "py-4 px-6",
      },
    },
    defaultVariants: {
      variant: "background",
      size: "small",
    },
  }
);

interface CustomLinkButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  href: string;
  className?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}

export const CustomLinkButton = ({
  children,
  href,
  variant,
  size,
  className,
  target = "_self",
  rel,
}: CustomLinkButtonProps) => {
  return (
    <Link
      href={href}
      className={twMerge(buttonVariants({ variant, size }), className)}
      target={target}
      rel={rel}
    >
      {children}
    </Link>
  );
};
