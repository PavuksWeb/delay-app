import { Module } from '@nestjs/common';
import { LimiterService } from './limiter.service';
import { LimiterController } from './limiter.controller';

@Module({
  providers: [LimiterService],
  controllers: [LimiterController],
})
export class LimiterModule {}
