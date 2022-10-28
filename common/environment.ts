export function isBrowser() {
  return typeof window !== 'undefined';
}

export function isNode() {
  return !isBrowser();
}
