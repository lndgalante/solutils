export function toFixed(n: number, fixed: number): number {
  return ~~(Math.pow(10, fixed) * n) / Math.pow(10, fixed);
}
