import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('api')
export class LimiterController {
  @Get(':idx')
  async handle(@Param('idx') idx: string, @Res() res: Response) {
    const delay = Math.floor(Math.random() * 1000) + 1;
    await new Promise<void>((resolve) => setTimeout(() => resolve(), delay));

    return res.status(HttpStatus.OK).json({ index: Number(idx), delay });
  }
}
