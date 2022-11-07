export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function isNode(): boolean {
  return !isBrowser();
}
