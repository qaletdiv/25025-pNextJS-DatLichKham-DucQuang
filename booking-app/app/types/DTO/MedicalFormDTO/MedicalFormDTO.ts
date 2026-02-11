export type ImageUploadDTO = {
    url: string, 
    public_id: string, 
    _id: string
}

export type MedicalFormDTO = {
    description: string, 
    pastMedicalHistory?: string, 
    images?: ImageUploadDTO[]
}