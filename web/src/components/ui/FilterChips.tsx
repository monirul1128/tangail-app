"use client";

interface Option {
  id: string;
  label: string;
}

interface FilterChipsProps {
  options: Option[];
  selected: string;
  onChange: (id: string) => void;
  allLabel?: string;
}

export default function FilterChips({
  options,
  selected,
  onChange,
  allLabel = "সব",
}: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("")}
        className={selected === "" ? "chip-active" : "chip"}
      >
        {allLabel}
      </button>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={selected === opt.id ? "chip-active" : "chip"}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
