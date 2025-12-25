import MedicalFormDetail from "../components/MedicalFormDetail"

export default async function MedicalDetail({ params }: { params: { id: string } }) {
    const { id } = await params
    console.log(id)
    return (
        <MedicalFormDetail id={id} />
    )
}