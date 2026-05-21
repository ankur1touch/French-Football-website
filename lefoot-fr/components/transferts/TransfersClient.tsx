"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchTransfers } from "@/store/features/transfersSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Tabs from "@/components/ui/Tabs";
import TransferCard from "./TransferCard";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";

const statusTabs = [
  { id: "Tous", label: "Tous" },
  { id: "Officiel", label: "Officiel" },
  { id: "Rumeur", label: "Rumeur" },
];

const windowTabs = [
  { id: "Tous", label: "Toutes fenêtres" },
  { id: "Été", label: "Été" },
  { id: "Hiver", label: "Hiver" },
];

export default function TransfersClient() {
  const dispatch = useAppDispatch();
  const { transfers, status, error } = useAppSelector((state) => state.transfers);
  const [transferStatus, setTransferStatus] = useState("Tous");
  const [window, setWindow] = useState("Tous");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTransfers());
    }
  }, [dispatch, status]);

  const filtered = useMemo(() => {
    return transfers.filter((t) => {
      const statusMatch = transferStatus === "Tous" || t.status === transferStatus;
      const windowMatch = window === "Tous" || t.window === window;
      return statusMatch && windowMatch;
    });
  }, [transfers, transferStatus, window]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">{error}</p>
        <Button className="mt-4" onClick={() => dispatch(fetchTransfers())}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-primary">Transferts</h1>
      <Tabs
        tabs={statusTabs}
        activeTab={transferStatus}
        onChange={setTransferStatus}
        className="mb-4"
      />
      <Tabs
        tabs={windowTabs}
        activeTab={window}
        onChange={setWindow}
        className="mb-6"
      />
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-gray-500">Aucun transfert trouvé.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((transfer) => (
            <TransferCard key={transfer.id} transfer={transfer} />
          ))}
        </div>
      )}
    </div>
  );
}
