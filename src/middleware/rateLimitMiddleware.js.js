// src/middleware/rateLimitMiddleware.js
import { Ratelimit } from "@upstash/ratelimit"; // Import Ratelimit
import { kv } from '@vercel/kv'; // Import kv

const { limit } = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(100, '60 s'), // 100 requests from the same IP in 60 seconds
});

export default function rateLimitMiddleware(handler) {
    return async (req, res) => {
        // Skip rate limiting in development
        if (process.env.NODE_ENV === 'development') {
            return handler(req, res);
        }

        const ip = req.headers[ 'x-forwarded-for' ] || req.connection.remoteAddress;

        // Rate limit check
        const { success } = await limit(ip); // Check rate limit for the IP
        if (!success) {
            return res.status(429).json({ error: 'Rate limit exceeded' }); // Handle rate limit exceeded
        }

        // For non-rate-limited requests, proceed to the handler
        return handler(req, res);
    };
}