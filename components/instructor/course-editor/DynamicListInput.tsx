import { useState } from 'react';

export function DynamicListInput({ items, onChange, placeholder }) {
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
            >Remove</button>
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
        >Add</button>
      </div>
    </div>
  );
} 