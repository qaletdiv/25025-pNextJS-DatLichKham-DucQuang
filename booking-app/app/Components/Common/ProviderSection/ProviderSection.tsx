import Container from "../Container/Container";
import {
  Calendar,
  Stethoscope,
  Hospital,
  HeartPulse,
  Pill,
  FlaskConical,
  Home,
} from "lucide-react";

export default function ProviderSection() {
  return (
    <section className="-mt-16 relative z-20 ">
      <Container>
        <div className="bg-white rounded-xl shadow-lg px-8 py-6">
          <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
            <li className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Calendar />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Book Appointment
              </span>
            </li>

            <li className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Stethoscope />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Talk to Doctors
              </span>
            </li>

            <li className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Hospital />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Hospitals & Clinics
              </span>
            </li>

            <li className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <HeartPulse />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Healthcare
              </span>
            </li>

            <li className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Pill />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Medicine & Supplies
              </span>
            </li>

            <li className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <FlaskConical />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Lab Testing
              </span>
            </li>

            <li className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Home />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Home Care
              </span>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
