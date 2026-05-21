import type { Transfer } from "@/types/transfer";
import Badge from "@/components/ui/Badge";

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

interface TransferCardProps {
  transfer: Transfer;
}

export default function TransferCard({ transfer }: TransferCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
        {getInitials(transfer.player)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900">{transfer.player}</p>
          <Badge variant={transfer.status === "Officiel" ? "category" : "default"}>
            {transfer.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-500">
          {transfer.from} → {transfer.to}
        </p>
        <p className="text-xs text-gray-400">Mercato {transfer.window}</p>
      </div>
      <span className="shrink-0 text-lg font-bold text-form-win">{transfer.fee}</span>
    </div>
  );
}
