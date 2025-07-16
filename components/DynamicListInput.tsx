import { useState } from 'react';

interface DynamicListInputProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export default function DynamicListInput({ items, onChange, placeholder }: DynamicListInputProps) {
  const [input, setInput] = useState('');

  return (
    <div>
      <ul className="mb-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span>{item}</span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              className="text-red-500"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={placeholder}
          className="border rounded px-2 py-1"
        />
        <button
          type="button"
          onClick={() => {
            if (input.trim()) {
              onChange([...items, input.trim()]);
              setInput('');
            }
          }}
          className="bg-[#4ECDC4] text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
} 