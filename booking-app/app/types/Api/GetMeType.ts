export type UserInfo = {
    _id: string, 
    username: string 
    email: string,
    role: "doctor" | "patient" | "staff";
    createdAt: string, 
    updatedAt: string
    __v?: number;
}

export type GetMeResponse = {
  account: UserInfo;
};