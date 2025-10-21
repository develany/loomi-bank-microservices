import { UserBankingDetails } from "../types/UserTypes";

export interface UpdateUserDto {
  name?: string;
  email?: string;
  address?: string;
  bankingDetails?: UserBankingDetails;
}
