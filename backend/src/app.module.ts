import { Module } from '@nestjs/common';
import { LimiterModule } from './limiter/limiter.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    LimiterModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 1000,
          limit: 50,
        },
      ],
      errorMessage: 'Too Many Requests!',
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
