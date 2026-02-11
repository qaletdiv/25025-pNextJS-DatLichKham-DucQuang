export type ImagesType = {
    url: string,
    public_id: string,
    _id: string,
}

export type PatientType = {
    _id: string,
    username: string,
    email: string
}

export type DepartmentType = {
    _id: string,
    name: string,
    description: string
}

export type MedicalFormResponse = {
    _id: string,
    patient: PatientType,
    images: ImagesType[]
    description: string,
    pastMedicalHistory: string,
    status: "pending" | "approved" | "rejected",
    rejectedMessage: string | null,
    department: DepartmentType | null,
    createdAt: string,
    updatedAt: string,
    __v: number
}

export type createMedicalFormResponse = {
    message: string,
    form: MedicalFormResponse
}

export type fetchMedicalFormsResponse = {
    message: string,
    forms: MedicalFormResponse[]
}

export type fetchDetailMedicalFormResponse = {
    message: string,
    medicalForm: MedicalFormResponse
}