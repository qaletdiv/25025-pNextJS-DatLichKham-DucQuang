import { type Account } from "../AccountType/AccountType";
export type AuthType = {
  account: Account | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};
