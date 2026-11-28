//limite de pedidos por IP
//guardado na memória do servidor
const WINDOW_MS = 60_000;

const hits = new Map<string, number[]>();


//true = passou do limite, false = ainda pode pedir
export function isRateLimited(key: string, maxRequests = 5): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= maxRequests) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);
  return false;
}