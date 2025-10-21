import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { CreateTransactionDto } from '../dtos/CreateTransactionDto';
import { EventService } from '../../../config/rabbitmq';

@Injectable()
export class TransactionService {
    constructor(
        private readonly transactionRepository: TransactionRepository,
    ) { }

    private async validateUsers(senderUserId: string, receiverUserId: string) {
        try {
            const usersApi = process.env.USERS_API || 'http://users-service:3000';
            const [sender, receiver] = await Promise.all([
                axios.get(`${usersApi}/api/users/${senderUserId}`, { timeout: 3000 }),
                axios.get(`${usersApi}/api/users/${receiverUserId}`, { timeout: 3000 })
            ]);

            if (!sender.data) {
                throw new BadRequestException('Usuário remetente não encontrado');
            }

            if (!receiver.data) {
                throw new BadRequestException('Usuário destinatário não encontrado');
            }
        } catch (error) {
            if (error.response) {
                throw new BadRequestException(error.response.data.message || 'Erro ao validar usuários');
            }
            throw new BadRequestException('Erro ao comunicar com o serviço de usuários');
        }
    }

    async create(data: CreateTransactionDto) {
        await this.validateUsers(data.senderUserId, data.receiverUserId);

        const transaction = await this.transactionRepository.create({
            ...data,
            status: 'SUCCESS'
        });

        await EventService.publishTransactionCreated(transaction.id);

        return transaction;
    }

    async findById(id: string) {
        const transaction = await this.transactionRepository.findById(id);
        if (!transaction) {
            throw new NotFoundException('Transação não encontrada');
        }
        return transaction;
    }

    async findByUser(userId: string) {
        return await this.transactionRepository.findByUser(userId);
    }
}