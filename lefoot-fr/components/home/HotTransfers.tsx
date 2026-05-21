"use client";

import { useAppSelector } from "@/store/hooks";
import Skeleton from "@/components/ui/Skeleton";
import { useTranslations } from "@/components/providers/LocaleProvider";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function HotTransfers() {
  const { transfers, status } = useAppSelector((state) => state.transfers);
  const t = useTranslations();

  const hotTransfers = transfers.slice(0, 3);

  if (status === "loading" || status === "idle") {
    return (
      <div className="mt-8">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-700">
          {t.home.hotTransfers}
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-700">
        {t.home.hotTransfers}
      </h2>
      <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
        {hotTransfers.map((transfer) => (
          <div key={transfer.id} className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {getInitials(transfer.player)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-gray-900">{transfer.player}</p>
              <p className="truncate text-xs text-gray-500">
                {transfer.from} → {transfer.to}
              </p>
            </div>
            <span className="shrink-0 text-sm font-bold text-form-win">{transfer.fee}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
