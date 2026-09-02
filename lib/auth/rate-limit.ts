import "server-only";

// Tek uzun ömürlü Node süreci için in-memory rate limit yeterli.
// (Çok süreçli/serverless kuruluma geçilirse Redis'e taşınmalı.)
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  bucket.count += 1;
  if (buckets.size > 10_000) {
    // taşma emniyeti: süresi geçmişleri süpür
    for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k);
  }
  return bucket.count <= MAX_ATTEMPTS;
}
