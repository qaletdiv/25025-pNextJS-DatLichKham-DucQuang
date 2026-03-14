import MedicalFormStaff from "@/app/Components/MedicalForm/MedicalFormStaff";
import PaymentList from "@/app/Components/Payment/PaymentList";
import Container from "@/app/Components/Common/Container/Container";
import Link from "next/link";
const TABS = [
  { key: "medical", label: "Phiếu khám bệnh" },
  { key: "payment", label: "Thanh toán" },
];

interface Props {
  searchParams: { tab?: string };
}

export default async function StaffDashBoard({ searchParams }: Props) {
  const { tab, page } = await searchParams;
  const activeTab = tab || "medical";

  return (
    <Container>
      <div className="flex border-b mb-4">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`?tab=${tab.key}`}
            className={`px-6 py-2 font-medium transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {activeTab === "medical" && <MedicalFormStaff />}
      {activeTab === "payment" && <PaymentList page={Number(page) || 1} />}
    </Container>
  );
}
