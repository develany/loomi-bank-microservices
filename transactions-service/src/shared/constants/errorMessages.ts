export enum ErrorMessages {
  TRANSACTION_NOT_FOUND = "Transação não encontrada",
  SENDER_USER_NOT_FOUND = "Usuário remetente não encontrado",
  RECEIVER_USER_NOT_FOUND = "Usuário destinatário não encontrado",
  USERS_SERVICE_ERROR = "Erro ao comunicar com o serviço de usuários",
  INVALID_AMOUNT = "Valor da transação inválido",
  SAME_USER_TRANSFER = "Não é possível transferir para si mesmo",
  TRANSACTION_CREATION_FAILED = "Falha ao criar transação",
}
