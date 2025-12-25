import MedicalDetailComponent from "../components/MedicalDetail"

export default async function MedicalFormDetail ({ params }: { params: { id: string } }) {
    const {id} = await params;
    return <div>
        <MedicalDetailComponent id={id}/>
    </div>
}