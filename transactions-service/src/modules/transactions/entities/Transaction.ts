import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";
import { TransactionStatus } from "../types/TransactionTypes";
import { ApiProperty } from "@nestjs/swagger";

@Entity("transactions")
export class Transaction {
  @ApiProperty({
    description: 'The unique identifier of the transaction',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    description: 'The user ID of the sender',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @Column()
  @Index()
  senderUserId: string;

  @ApiProperty({
    description: 'The user ID of the receiver',
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @Column()
  @Index()
  receiverUserId: string;

  @ApiProperty({
    description: 'The amount of the transaction',
    example: 100.50
  })
  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'The description of the transaction',
    example: 'Payment for services',
    required: false
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'The status of the transaction',
    enum: TransactionStatus,
    example: TransactionStatus.SUCCESS
  })
  @Column({
    type: "enum",
    enum: TransactionStatus,
    default: TransactionStatus.SUCCESS,
  })
  @Index()
  status: TransactionStatus;

  @ApiProperty({
    description: 'The date when the transaction was created',
    example: '2023-01-01T00:00:00Z'
  })
  @CreateDateColumn()
  @Index()
  createdAt: Date;
}