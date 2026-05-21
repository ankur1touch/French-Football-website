"use client";

import { useState } from "react";
import { useTranslations } from "@/components/providers/LocaleProvider";

const pollOptions = [
  { id: "mbappe", label: "Mbappé", percentage: 54 },
  { id: "benyedder", label: "Ben Yedder", percentage: 28 },
  { id: "remy", label: "Rémy", percentage: 18 },
];

export default function PollWidget() {
  const [voted, setVoted] = useState<string | null>(null);
  const t = useTranslations();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-700">
        {t.poll.title}
      </h2>
      <p className="mb-4 text-sm font-medium text-gray-900">{t.home.pollQuestion}</p>
      <div className="space-y-3">
        {pollOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setVoted(option.id)}
            className="w-full text-left"
            disabled={voted !== null && voted !== option.id}
          >
            <div className="mb-1 flex justify-between text-xs">
              <span className={voted === option.id ? "font-semibold text-primary" : ""}>
                {option.label}
              </span>
              <span className="text-gray-500">{option.percentage}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary-light transition-all"
                style={{ width: `${option.percentage}%` }}
              />
            </div>
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-400">4 821 {t.poll.votes}</p>
    </div>
  );
}
