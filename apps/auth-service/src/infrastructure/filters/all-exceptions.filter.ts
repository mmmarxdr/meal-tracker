// apps/auth-service/src/infrastructure/filters/all-exceptions.filter.ts

import { Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

interface HttpExceptionResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class AllExceptionsFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  override catch(exception: unknown, host: ArgumentsHost): Observable<unknown> {
    this.logger.error(
      `Exception caught in AllExceptionsFilter: ${JSON.stringify(exception)}`,
    );
    this.logger.error(`Exception type: ${exception?.constructor?.name}`);
    this.logger.error(
      `Exception message: ${exception instanceof Error ? exception.message : 'unknown'}`,
    );

    if (exception instanceof RpcException) {
      return super.catch(exception, host);
    }

    if (this.isHttpException(exception)) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      let message: string | string[];
      let error: string;

      if (typeof response === 'string') {
        message = response;
        error = exception.name;
      } else {
        const httpResponse = response as HttpExceptionResponse;
        message = httpResponse.message ?? exception.message;
        error = httpResponse.error ?? exception.name;
      }

      const errorResponse: ErrorResponse = {
        statusCode: status,
        message,
        error,
      };

      this.logger.error(
        `HTTP Exception (${status}): ${JSON.stringify(errorResponse)}`,
      );

      return throwError(() => errorResponse);
    }

    const errorResponse: ErrorResponse = {
      statusCode: this.extractStatusCode(exception),
      message:
        exception instanceof Error
          ? exception.message
          : 'Internal server error',
      error: this.extractErrorName(exception),
    };

    this.logger.error(
      `Other exception converted to RPC: ${JSON.stringify(errorResponse)}`,
    );

    return throwError(() => errorResponse);
  }

  private isHttpException(exception: unknown): exception is HttpException {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'getStatus' in exception &&
      'getResponse' in exception &&
      typeof (exception as HttpException).getStatus === 'function' &&
      typeof (exception as HttpException).getResponse === 'function'
    );
  }

  private extractStatusCode(exception: unknown): number {
    this.logger.log(
      `Extracting status code from exception: ${JSON.stringify(exception)}`,
    );
    if (typeof exception === 'object' && exception !== null) {
      const exc = exception as Record<string, unknown>;
      if (typeof exc['statusCode'] === 'number') {
        return exc['statusCode'];
      }
      if (typeof exc['status'] === 'number') {
        return exc['status'];
      }
    }

    if (exception instanceof Error) {
      const statusMap: Record<string, number> = {
        UnauthorizedException: 401,
        BadRequestException: 400,
        ConflictException: 409,
        NotFoundException: 404,
        ForbiddenException: 403,
        NotAcceptableException: 406,
        RequestTimeoutException: 408,
        GoneException: 410,
        PayloadTooLargeException: 413,
        UnsupportedMediaTypeException: 415,
        UnprocessableEntityException: 422,
        InternalServerErrorException: 500,
        NotImplementedException: 501,
        BadGatewayException: 502,
        ServiceUnavailableException: 503,
        GatewayTimeoutException: 504,
      };
      return statusMap[exception.constructor.name] ?? 500;
    }

    return 500;
  }

  private extractErrorName(exception: unknown): string {
    if (exception instanceof Error) {
      const nameMap: Record<string, string> = {
        UnauthorizedException: 'Unauthorized',
        BadRequestException: 'Bad Request',
        ConflictException: 'Conflict',
        NotFoundException: 'Not Found',
        ForbiddenException: 'Forbidden',
      };
      return nameMap[exception.constructor.name] ?? 'Internal Server Error';
    }
    return 'Internal Server Error';
  }
}
