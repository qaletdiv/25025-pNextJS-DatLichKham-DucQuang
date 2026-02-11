import { fetchMedicalForm } from "../action";
import MedicalFormListComponent from "@/app/Components/MedicalForm/MedicalFormListComponent";

export default async function MedicalFormPage() {
  const result = await fetchMedicalForm();

  if ("error" in result) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {result.error}
        </div>
      </div>
    );
  }

  return <MedicalFormListComponent forms={result.forms} />;
}
