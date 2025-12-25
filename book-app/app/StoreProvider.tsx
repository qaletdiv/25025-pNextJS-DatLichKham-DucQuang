"use client";

import { Provider } from "react-redux";
import { ReactNode, useRef } from "react";
import { makeStore } from "@/app/redux/store";

type StoreProviderProps = {
  children: ReactNode;
};

export default function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
