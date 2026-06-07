import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import type { ApiResponse } from '../response/api-response';

/** Bắt mọi exception và trả về cùng envelope { success:false, statusCode, message, error }. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: unknown = null;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'string') {
        message = response;
      } else if (response && typeof response === 'object') {
        const r = response as Record<string, unknown>;
        if (Array.isArray(r.message)) {
          message = r.message.join(', ');
        } else if (typeof r.message === 'string') {
          message = r.message;
        } else {
          message = exception.message;
        }
        error = r;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log lỗi server (5xx) kèm stack để debug.
    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception);
    }

    const body: ApiResponse<never> = {
      success: false,
      statusCode,
      message,
      error,
    };
    res.status(statusCode).json(body);
  }
}
