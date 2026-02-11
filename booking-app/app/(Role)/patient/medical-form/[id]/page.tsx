import MedicalFormDetail from "@/app/Components/MedicalForm/MedicalFormDetail";
import { type ParamType } from "@/app/types/Common/ParamType";


export default async function MedicalFormDetailPage({params}: {params: ParamType}) {
    const {id}: ParamType = await params
    return (
        <div>
            <MedicalFormDetail id={id}/>
        </div>
    )
}