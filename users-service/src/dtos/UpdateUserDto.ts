import { UserBankingDetails } from "../types/UserTypes";

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         address:
 *           type: string
 *         bankingDetails:
 *           $ref: '#/components/schemas/UserBankingDetails'
 */
export interface UpdateUserDto {
  name?: string;
  email?: string;
  address?: string;
  bankingDetails?: UserBankingDetails;
}