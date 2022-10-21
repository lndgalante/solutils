export function getTruncatedText(text: string, length: number, separator: string): string {
  return `${text.substring(0, length)}${separator}${text.substring(text.length - length)}`;
}
