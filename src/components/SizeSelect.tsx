import { sizeOptions } from '../constants/options';

interface SizeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function SizeSelect({ value, onChange }: SizeSelectProps) {
  return (
    <select
      className="input-brutal w-full cursor-pointer bg-transparent p-2 font-mono text-xs sm:p-3 sm:text-sm"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {sizeOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
