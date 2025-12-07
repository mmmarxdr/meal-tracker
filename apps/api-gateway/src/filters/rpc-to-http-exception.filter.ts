import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface RpcError {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

interface HttpExceptionResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class RpcToHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcToHttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(`Exception caught: ${JSON.stringify(exception)}`);

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let message: string | string[];
      let error: string;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name;
      } else {
        const httpResponse = exceptionResponse as HttpExceptionResponse;
        message = httpResponse.message ?? exception.message;
        error = httpResponse.error ?? exception.name;
      }

      response.status(status).json({
        statusCode: status,
        message,
        error,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }

    if (this.isRpcError(exception)) {
      response.status(exception.statusCode).json({
        statusCode: exception.statusCode,
        message: exception.message,
        error: exception.error,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json({
      statusCode: status,
      message:
        exception instanceof Error
          ? exception.message
          : 'Internal server error',
      error: 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private isRpcError(exception: unknown): exception is Required<RpcError> {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'statusCode' in exception &&
      typeof (exception as RpcError).statusCode === 'number'
    );
  }
}
