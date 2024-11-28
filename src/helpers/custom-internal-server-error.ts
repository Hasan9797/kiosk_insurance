import { HttpException } from '@nestjs/common'

export class CustomInternalServerErrorException extends HttpException {
  constructor(statusCode: number, message: string) {
    super(
      {
        statusCode,
        message,
        error: 'INTERNAL_SERVER_ERROR',
      },
      statusCode,
    )
  }
}
