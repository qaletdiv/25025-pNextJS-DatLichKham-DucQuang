"use client";
import Button from "../../UI/Button";
import Container from "../Container/Container";
import { Calendar } from "lucide-react";
export default function HeroSection() {
  return (
    <section
      className="
        relative
        bg-blue-400
        py-24
        overflow-hidden
      "
      style={{
        backgroundImage: "url('./images/hero3.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-blue-500/70"></div>

      <Container>
        <div className="relative z-10 max-w-2xl flex flex-col gap-8">
          <div className="space-y-4">
            <h1 className="font-bold text-white text-3xl md:text-5xl leading-tight">
              Find your doctor and make an appointment.
            </h1>
            <p className="text-gray-100 text-lg">
              Select preferred doctor and time slot to book appointment or
              consultation
            </p>
          </div>

          <Button
            variant="primary"
            className="flex gap-2 items-center px-8 py-3 text-lg w-fit cursor-pointer"
          >
            Booking Appointment <Calendar />
          </Button>

          <div className="pt-4 border-t border-white/30 w-fit">
            <p className="text-white/80 text-sm">
              Online consultation registrations
            </p>
            <p className="text-white flex items-end gap-2">
              <span className="text-4xl font-bold ">50K+</span>
              <span className="text-sm text-white/80">registered users</span>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
