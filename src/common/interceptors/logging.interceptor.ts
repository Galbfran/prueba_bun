import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';

/** Una sola lectura de tiempo por request; sin crear instancias de Date. */
const nowMs = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const { method, url } = context.switchToHttp().getRequest<FastifyRequest>();
  
    const start = nowMs();

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse();
          const statusCode = res.statusCode;
          const duration = Math.round(nowMs() - start);
          this.logger.log(
            `${method} ${url} ${statusCode} - ${duration}ms`,
          );
        },
        error: () => {
          const duration = Math.round(nowMs() - start);
          this.logger.warn(`${method} ${url} - ${duration}ms (error)`);
        },
      }),
    );
  }
}
