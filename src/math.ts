export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function sum(values: Iterable<number>): number {
  let total = 0;
  for (const value of values) total += value;
  return total;
}

export function sumWeights(weights: Record<string, number>): number {
  return sum(Object.values(weights));
}

export function calculateTurnoverBps(
  current: Record<string, number>,
  target: Record<string, number>,
): number {
  const symbols = new Set([...Object.keys(current), ...Object.keys(target)]);
  let absoluteChange = 0;
  for (const symbol of symbols) {
    absoluteChange += Math.abs((target[symbol] ?? 0) - (current[symbol] ?? 0));
  }
  return Math.round(absoluteChange / 2);
}

function scaleDeltasToTotal(
  deltas: Array<{ symbol: string; amount: number }>,
  total: number,
): Map<string, number> {
  const sourceTotal = sum(deltas.map(({ amount }) => amount));
  if (sourceTotal === 0 || total === 0) return new Map();

  const scaled = deltas.map(({ symbol, amount }) => {
    const exact = (amount * total) / sourceTotal;
    return { symbol, amount: Math.floor(exact), remainder: exact - Math.floor(exact) };
  });

  let remainder = total - sum(scaled.map(({ amount }) => amount));
  scaled.sort((a, b) => b.remainder - a.remainder || a.symbol.localeCompare(b.symbol));
  for (let index = 0; remainder > 0; index = (index + 1) % scaled.length) {
    scaled[index].amount += 1;
    remainder -= 1;
  }

  return new Map(scaled.map(({ symbol, amount }) => [symbol, amount]));
}

export function capTurnover(
  current: Record<string, number>,
  target: Record<string, number>,
  maximumTurnoverBps: number,
): Record<string, number> {
  const turnover = calculateTurnoverBps(current, target);
  if (turnover <= maximumTurnoverBps) return { ...target };

  const symbols = new Set([...Object.keys(current), ...Object.keys(target)]);
  const sells: Array<{ symbol: string; amount: number }> = [];
  const buys: Array<{ symbol: string; amount: number }> = [];

  for (const symbol of symbols) {
    const delta = (target[symbol] ?? 0) - (current[symbol] ?? 0);
    if (delta < 0) sells.push({ symbol, amount: -delta });
    if (delta > 0) buys.push({ symbol, amount: delta });
  }

  const scaledSells = scaleDeltasToTotal(sells, maximumTurnoverBps);
  const scaledBuys = scaleDeltasToTotal(buys, maximumTurnoverBps);
  const capped: Record<string, number> = { ...current };

  for (const [symbol, amount] of scaledSells) capped[symbol] = (capped[symbol] ?? 0) - amount;
  for (const [symbol, amount] of scaledBuys) capped[symbol] = (capped[symbol] ?? 0) + amount;

  return capped;
}
