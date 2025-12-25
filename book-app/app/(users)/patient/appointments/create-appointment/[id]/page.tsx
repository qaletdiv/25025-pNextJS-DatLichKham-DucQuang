import AppointmentInput from "../../components/AppointmentInput";

export default async function AppointmentPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <AppointmentInput />;
}
