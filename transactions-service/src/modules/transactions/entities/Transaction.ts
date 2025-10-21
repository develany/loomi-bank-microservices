import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";
import { TransactionStatus } from "../types/TransactionTypes";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Index()
  senderUserId: string;

  @Column()
  @Index()
  receiverUserId: string;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: TransactionStatus,
    default: TransactionStatus.SUCCESS,
  })
  @Index()
  status: TransactionStatus;

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}
