export function isValidYear(y?: string) {
  if (!y) return false;
  const n = Number(y);
  const now = new Date().getFullYear();
  return Number.isInteger(n) && n >= 1000 && n <= now + 1;
}

export function isDOI(input?: string) {
  if (!input) return false;
  return /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i.test(input.trim());
}

export function isISBN(input?: string) {
  if (!input) return false;
  const s = input.replace(/[-\s]/g, '');
  return /^(\d{10}|\d{13})$/.test(s);
}

export function isURL(input?: string) {
  if (!input) return false;
  try {
    new URL(input);
    return true;
  } catch {
    return false;
  }
}


