import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export const rateLimit = (options: { windowMs?: number; max?: number; message?: string }) => {
  const windowMs = options.windowMs || 60 * 1000; // 1 minute by default
  const max = options.max || 100; // 100 requests per windowMs by default
  const message = options.message || 'Too many requests, please try again later.';

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const key = `${ip}:${req.path}`;
    const now = Date.now();

    // Initialize or reset if expired
    if (!store[key] || now > store[key].resetTime) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs
      };
      return next();
    }

    // Increment count
    store[key].count++;

    // Check if over limit
    if (store[key].count > max) {
      return res.status(429).json({
        message
      });
    }

    return next();
  };
};