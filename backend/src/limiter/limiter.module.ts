import { Module } from '@nestjs/common';
import { LimiterController } from './limiter.controller';

@Module({
  controllers: [LimiterController],
})
export class LimiterModule {}
