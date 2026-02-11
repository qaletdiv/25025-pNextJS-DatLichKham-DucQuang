import { type ChildrenProp } from "@/app/types/Common/CommonType";
export default function AuthContainer({ children, className }: ChildrenProp) {
  return (
    <div
      className={`flex min-h-screen items-center justify-center ${className}`}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {children}
      </div>
    </div>
  );
}
