import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/Transaction';

@Injectable()
export class TransactionRepository {
    constructor(
        @InjectRepository(Transaction)
        private readonly repository: Repository<Transaction>,
    ) { }

    async create(data: Partial<Transaction>): Promise<Transaction> {
        const transaction = this.repository.create(data);
        return await this.repository.save(transaction);
    }

    async findById(id: string): Promise<Transaction> {
        return await this.repository.findOne({ where: { id } });
    }

    async findByUser(userId: string): Promise<Transaction[]> {
        return await this.repository.find({
            where: [
                { senderUserId: userId },
                { receiverUserId: userId }
            ],
            order: {
                createdAt: 'DESC'
            }
        });
    }
}