import { HttpException, HttpStatus } from "@nestjs/common";

export class ApplicationException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode);
  }
}
