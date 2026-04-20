// src/components/shared/SearchInput.tsx
"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Buscar..." }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--pt-text-dim)]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[var(--pt-border-dim)] bg-[var(--pt-card)] py-2.5 pl-10 pr-4 text-sm text-[var(--pt-text)] placeholder-[var(--pt-text-dim)] outline-none transition-colors focus:border-[var(--pt-gold)]"
      />
    </div>
  );
}
