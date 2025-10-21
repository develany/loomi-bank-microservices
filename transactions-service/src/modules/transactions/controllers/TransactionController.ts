import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { TransactionService } from '../services/TransactionService';
import { CreateTransactionDto } from '../dtos/CreateTransactionDto';

@Controller('api/transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Post()
    async create(@Body() data: CreateTransactionDto) {
        return this.transactionService.create(data);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.transactionService.findById(id);
    }

    @Get('user/:userId')
    async findByUser(@Param('userId') userId: string) {
        return this.transactionService.findByUser(userId);
    }
}