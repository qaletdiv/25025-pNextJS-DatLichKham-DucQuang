import { type ChildrenProp } from "@/app/types/Common/CommonType";

export default function Container({ children }: ChildrenProp) {
  return <div className="max-w-7xl mx-auto px-2 py-4">
    {children}
  </div>;
}
