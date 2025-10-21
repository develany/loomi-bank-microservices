export type UserId = string;

export interface UserBankingDetails {
  agency: string;
  account: string;
}

export interface UserData {
  id: UserId;
  name: string;
  email: string;
  address?: string;
  bankingDetails?: UserBankingDetails;
  profilePicture?: string | null;
  createdAt: Date;
  updatedAt: Date;
}