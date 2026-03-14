import MedicalFormDetail from "@/app/Components/MedicalForm/MedicalFormDetail";
import { type ParamType } from "@/app/types/Common/ParamType";
import { fetchDetailMedicalForm } from "@/app/(Role)/patient/action";

export default async function MedicalFormDetailPage({
  params,
}: {
  params: ParamType;
}) {
  const { id }: ParamType = await params;
  const result = await fetchDetailMedicalForm(id);
  if ("error" in result) {
    return <div className="p-6 text-red-500">{result.error}</div>;
  }
  return (
    <div>
      <MedicalFormDetail id={id} data={result.medicalForm} />
    </div>
  );
}
