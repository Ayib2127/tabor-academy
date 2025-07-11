import { X } from "lucide-react";

export function TagInput({ tags, onAdd, onRemove, placeholder = "" }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, i) => (
          <span key={i} className="flex items-center px-2 py-1 bg-[#E5E8E8] rounded text-sm text-[#2C3E50]">
            {tag}
            <button
              type="button"
              className="ml-1 text-[#FF6B35] hover:text-red-600 focus:outline-none"
              onClick={() => onRemove(i)}
              aria-label={`Remove ${tag}`}
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>
      <input
        className="input input-bordered w-full"
        placeholder={placeholder}
        onKeyDown={e => {
          if ((e.key === "Enter" || e.key === ",") && e.currentTarget.value.trim()) {
            e.preventDefault();
            onAdd(e.currentTarget.value.trim());
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
} 