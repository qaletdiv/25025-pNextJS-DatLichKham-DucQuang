export type MedicalImage = {
  _id: string;
  url: string;
  public_id: string;
}

export type Patient = {
  _id: string;
  username: string;
  email: string;
}

export type MedicalForm = {
  _id: string;
  rejectedMessage: string | null;
  patient: Patient;
  images: MedicalImage[];
  description: string;
  pastMedicalHistory: string;
  status: "pending" | "approved" | "rejected"; // nếu bạn có enum
  createdAt: string;
  updatedAt: string;
  department: string; // id chuyên khoa
}

export type MedicalFormListResponse = {
  message: string;
  forms: MedicalForm[];
}