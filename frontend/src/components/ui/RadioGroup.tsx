import type { InputHTMLAttributes, PropsWithChildren } from 'react';

type Option = { value: string; label: string };

export function RadioGroup({
  name,
  options,
  value,
  onChange
}: {
  name: string;
  options: Option[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div role="radiogroup" className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <label key={opt.value} className="inline-flex items-center gap-2">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={(e) => onChange(e.target.value)}
            className="accent-slate-900"
          />
          <span className="text-sm">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

export function Checkbox({
  label,
  ...props
}: PropsWithChildren<InputHTMLAttributes<HTMLInputElement> & { label: string }>) {
  return (
    <label className="inline-flex items-center gap-2">
      <input type="checkbox" className="accent-slate-900" {...props} />
      <span className="text-sm">{label}</span>
    </label>
  );
}


