export function WarningHint({ text, color = 'red' }: { text: string; color?: 'red' | 'yellow' | 'blue' }) {
  const map = {
    red: 'text-red-600',
    yellow: 'text-amber-600',
    blue: 'text-sky-600'
  } as const;
  return <span className={`text-xs ${map[color]} ml-2`}>{text}</span>;
}


