import { Injectable } from '@nestjs/common';

@Injectable()
export class LimiterService {
  private counters: Record<number, number> = {};
  private MAX_PER_SECOND = 50;

  public tryAcquire(): boolean {
    const sec = Math.floor(Date.now() / 1000);
    if (!this.counters[sec]) this.counters[sec] = 0;
    if (this.counters[sec] >= this.MAX_PER_SECOND) return false;
    this.counters[sec] += 1;
    const keys = Object.keys(this.counters).map((k) => parseInt(k, 10));
    for (const k of keys) {
      if (k < sec - 2) delete this.counters[k];
    }
    return true;
  }
}
