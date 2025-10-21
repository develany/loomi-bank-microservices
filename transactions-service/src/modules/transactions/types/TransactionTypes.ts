export type TransactionId = string;
export type UserId = string;

export enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export interface TransactionData {
  id: TransactionId;
  senderUserId: UserId;
  receiverUserId: UserId;
  amount: number;
  description?: string;
  status: TransactionStatus;
  createdAt: Date;
}
