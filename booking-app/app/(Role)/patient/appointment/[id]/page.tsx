import AppointmentDetail from "@/app/Components/Appointment/AppointmentDetail"
import Container from "@/app/Components/Common/Container/Container"
import { getDetailAppointment } from "@/app/(Role)/patient/action"

interface Schedule {
    _id: string; 
    doctorId: string; 
    date: string; 
    startTime: string; 
    endTime: string
}
interface AppointmentDetail  {
   _id: string;
   scheduleId: Schedule; 
   medicalForm: string; 
   status: string; 
   mettingUrl: string;
   price: number; 
   createdAt: string;
   __v: number
}

export default async function AppointmentDetailPage({params} : {params: {id: string}}) {
    const {id} = await params; 
    const data = await getDetailAppointment(id);
    return (
        <Container>
            <AppointmentDetail id={id} data={data}/>
        </Container>
    )
}