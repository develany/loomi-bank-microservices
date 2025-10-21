import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateTransactionDto {
    @IsNotEmpty()
    @IsString()
    senderUserId: string;

    @IsNotEmpty()
    @IsString()
    receiverUserId: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsString()
    description?: string;
}