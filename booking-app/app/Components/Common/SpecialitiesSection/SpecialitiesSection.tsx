import Container from "../Container/Container";
import Badge from "../Bagde/Bagde";
import { HeartPulse, Bone, Brain, Baby, Smile } from "lucide-react";
const SPECIALITIES = [
  {
    id: 1,
    title: "Cardiology",
    doctors: 254,
    image: "/images/hero.jpg",
    icon: HeartPulse,
  },
  {
    id: 2,
    title: "Orthopedics",
    doctors: 151,
    image: "/images/hero.jpg",
    icon: Bone,
  },
  {
    id: 3,
    title: "Neurology",
    doctors: 176,
    image: "/images/hero.jpg",
    icon: Brain,
  },
  {
    id: 4,
    title: "Pediatrics",
    doctors: 124,
    image: "/images/hero.jpg",
    icon: Baby,
  },
  {
    id: 5,
    title: "Psychiatry",
    doctors: 112,
    image: "/images/hero.jpg",
    icon: Smile,
  },
];

export default function SpeciallitiesSection() {
  return (
    <section className="p-16">
      <Container>
        <div className="flex flex-col items-center gap-6">
          <Badge>Top Specialities</Badge>

          <h1 className="text-4xl font-bold text-center">
            Highlighting the{" "}
            <span className="text-blue-600">Care & Support</span>
          </h1>

          <ul className="mt-6 flex flex-wrap justify-center gap-6">
            {SPECIALITIES.map((item) => (
              <li key={item.id} className="group w-[220px] cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-[240px] w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  
                  <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/30" />

                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow transition group-hover:bg-blue-600">
                      {(() => {
                        const Icon = item.icon;
                        return (
                          <Icon className="h-7 w-7 text-blue-600 transition group-hover:text-white" />
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    {item.doctors} Doctors
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
