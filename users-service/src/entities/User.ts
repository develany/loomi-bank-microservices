import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { UserBankingDetails } from "../types/UserTypes";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserBankingDetails:
 *       type: object
 *       properties:
 *         accountNumber:
 *           type: string
 *         bankName:
 *           type: string
 *         branchCode:
 *           type: string
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         address:
 *           type: string
 *           nullable: true
 *         bankingDetails:
 *           $ref: '#/components/schemas/UserBankingDetails'
 *         profilePicture:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
@Entity("users")
@Index(["email"], { unique: true })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Index()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: "jsonb", nullable: true })
  bankingDetails: UserBankingDetails;

  @Column({ nullable: true })
  profilePicture: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}