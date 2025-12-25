import { type ButtonProps } from "@/lib/ButtonProps/ButtonProps";
export default function Button({
  children,
  size = "md",
  variant = "primary",
  onClick,
}: ButtonProps) {
  const sizeClass = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return;
}
