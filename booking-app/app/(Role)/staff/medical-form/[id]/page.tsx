import MedicalFormStaffDetail from "@/app/Components/MedicalForm/MedicalFormStaffDetail"
import { type ParamType } from "@/app/types/Common/ParamType"
export default async function MedicalDetail({params}: {params: ParamType}) {
    const {id} = await params
    return (
        <MedicalFormStaffDetail medicalId={id}/>
    )
}