export function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export function safeString(input?: string | null) {
  return (input ?? '').trim();
}

export function titleCase(input: string) {
  return input
    .toLowerCase()
    .split(' ')
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

export function sentenceCase(input: string) {
  const s = input.trim();
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}


