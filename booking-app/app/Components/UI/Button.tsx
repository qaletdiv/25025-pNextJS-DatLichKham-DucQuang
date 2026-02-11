import { type ButtonProps } from "@/app/types/UI/ButtonProps";
export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        px-4 py-2 rounded
        ${variant === "primary" && "bg-blue-500 text-white"}
        ${variant === "secondary" && "bg-gray-200"}
        ${variant === "danger" && "bg-red-500 text-white"}
        ${disabled && "opacity-50 cursor-not-allowed"}
        ${className ?? ""}
      `}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
