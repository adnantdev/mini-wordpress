"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface FaqListControlProps {
  value: { question: string; answer: string }[];
  onChange: (val: { question: string; answer: string }[]) => void;
}

export const FaqListControl: React.FC<FaqListControlProps> = ({
  value = [],
  onChange,
}) => {
  const items = Array.isArray(value) ? value : [];

  const handleUpdate = (idx: number, key: "question" | "answer", val: string) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [key]: val };
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([
      ...items,
      {
        question: "New question?",
        answer: "Provide a helpful response here.",
      },
    ]);
  };

  const handleRemove = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700">FAQ Accordion Items</span>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-3.5 h-3.5" /> Add Item
        </button>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={item.question}
                onChange={(e) => handleUpdate(idx, "question", e.target.value)}
                placeholder="Question"
                className="w-full px-2 py-1 font-medium bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="text-slate-400 hover:text-red-500 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              rows={2}
              value={item.answer}
              onChange={(e) => handleUpdate(idx, "answer", e.target.value)}
              placeholder="Answer details..."
              className="w-full px-2 py-1 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
