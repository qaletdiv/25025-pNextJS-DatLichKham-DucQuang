"use client";

import { useState } from "react";
import MedicalFormList from "./components/MedicalFormList";
import MedicalFormModal from "./components/MedicalFormModal";

export default function MedicalFormPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <MedicalFormList onOpenModal={() => setOpen(true)} />
      <MedicalFormModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
