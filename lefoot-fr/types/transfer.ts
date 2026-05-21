export type TransferStatus = "Officiel" | "Rumeur";
export type TransferWindow = "Été" | "Hiver";

export interface Transfer {
  id: string;
  player: string;
  from: string;
  to: string;
  fee: string;
  status: TransferStatus;
  window: TransferWindow;
}
