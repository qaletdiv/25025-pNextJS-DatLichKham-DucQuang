import DoctorDropDown from "@/app/Components/Appointment/DoctorFilter";
import Schedulue from "@/app/Components/Appointment/Schedule";
import Container from "@/app/Components/Common/Container/Container";

export default async function CreateAppointmentById({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <>
      <Container>
        <Schedulue medicalFormId={id} />
      </Container>
    </>
  );
}
