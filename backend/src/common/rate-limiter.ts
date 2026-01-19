import Bottleneck from 'bottleneck';

export const alchemyLimiter = new Bottleneck({
  maxConcurrent: 5,
  minTime: 100, // 10 req/sec
});

export const coingeckoLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 2000, // 0.5 req/sec (conservative)
});
