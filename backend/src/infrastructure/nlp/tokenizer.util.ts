const TOKEN_PATTERN = /[^a-zA-Zа-яА-ЯіїєґІЇЄҐ0-9\s]/g;

export function splitWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(TOKEN_PATTERN, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter((word) => word.length > 1);
}
