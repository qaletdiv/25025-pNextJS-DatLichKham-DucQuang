import { forwardRef } from "react";
import { type InputProps } from "@/app/types/UI/InputProps";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm">{label}</label>
        <input
          ref={ref}
          {...props}
          className="border p-2 rounded"
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
