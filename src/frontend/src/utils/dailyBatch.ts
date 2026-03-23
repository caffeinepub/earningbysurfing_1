import type { InventoryProduct } from "../backend";

// LCG-based seeded pseudo-random
function hashKey(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export function getDailyBatch(
  memberId: number | string,
  products: [bigint, InventoryProduct][],
): [bigint, InventoryProduct][] {
  if (products.length === 0) return [];

  const today = new Date().toISOString().slice(0, 10);
  const key = `${String(memberId)}_${today}`;
  const cacheKey = `ebs_batch_${memberId}_${today}`;

  // Try cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as Array<[string, InventoryProduct]>;
      return parsed.map(([idStr, p]) => [BigInt(idStr), p]);
    } catch {
      // ignore, recompute
    }
  }

  // Seeded Fisher-Yates shuffle
  const rand = seededRandom(hashKey(key));
  const shuffled: [bigint, InventoryProduct][] = [...products];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const batch = shuffled.slice(0, 10);

  // Cache (serialize BigInt as string)
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify(batch.map(([id, p]) => [id.toString(), p])),
    );
  } catch {
    // ignore storage errors
  }

  return batch;
}
