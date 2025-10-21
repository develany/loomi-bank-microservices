import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    senderUserId: string;

    @Column()
    receiverUserId: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    description: string;

    @Column({ default: 'SUCCESS' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}