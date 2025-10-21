import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsUUID,
  Min,
  MaxLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTransactionDto {
  @ApiProperty({ description: "ID do usuário remetente" })
  @IsNotEmpty({ message: "O ID do remetente é obrigatório" })
  @IsUUID("4", { message: "O ID do remetente deve ser um UUID válido" })
  senderUserId: string;

  @ApiProperty({ description: "ID do usuário destinatário" })
  @IsNotEmpty({ message: "O ID do destinatário é obrigatório" })
  @IsUUID("4", { message: "O ID do destinatário deve ser um UUID válido" })
  receiverUserId: string;

  @ApiProperty({ description: "Valor da transação", minimum: 0.01 })
  @IsNotEmpty({ message: "O valor é obrigatório" })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "O valor deve ser um número com no máximo 2 casas decimais" }
  )
  @Min(0.01, { message: "O valor mínimo é 0.01" })
  amount: number;

  @ApiPropertyOptional({ description: "Descrição da transação" })
  @IsOptional()
  @IsString({ message: "A descrição deve ser uma string" })
  @MaxLength(255, { message: "A descrição deve ter no máximo 255 caracteres" })
  description?: string;
}
