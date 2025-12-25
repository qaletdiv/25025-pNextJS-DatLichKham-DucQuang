export type MedicalForm = {
  id: number;
  description: string;
  images: string[];
  pastMedicalHistory: string;
};

export type CreateMedicalFormPayload = {
  description: string;
  images: File[];
  pastMedicalHistory: string;
};