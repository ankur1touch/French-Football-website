import type { Transfer, TransferStatus, TransferWindow } from "@/types/transfer";
import type { ApiTransferItem } from "../types";

function inferWindow(dateStr?: string): TransferWindow {
  if (!dateStr) return "Été";
  const month = new Date(dateStr).getMonth() + 1;
  return month >= 1 && month <= 2 ? "Hiver" : "Été";
}

function inferStatus(type?: string): TransferStatus {
  if (!type) return "Officiel";
  const t = type.toLowerCase();
  if (t.includes("rumour") || t.includes("rumeur")) return "Rumeur";
  return "Officiel";
}

export function mapTransferItem(item: ApiTransferItem, index: number): Transfer[] {
  const playerName = item.player?.name ?? "Joueur";
  const playerId = item.player?.id ?? index;

  return (item.transfers ?? []).slice(0, 1).map((t, i) => ({
    id: `${playerId}-${i}`,
    player: playerName,
    from: t.teams?.out?.name ?? "—",
    to: t.teams?.in?.name ?? "—",
    fee:
      t.type?.includes("Free") || t.type?.toLowerCase() === "free"
        ? "Gratuit"
        : t.type === "N/A" || t.type === "Loan"
          ? t.type === "Loan"
            ? "Prêt"
            : "—"
          : (t.type ?? "—"),
    status: inferStatus(t.type),
    window: inferWindow(t.date ?? item.update),
  }));
}

export function mapTransfers(items: ApiTransferItem[]): Transfer[] {
  return items.flatMap((item, index) => mapTransferItem(item, index));
}
