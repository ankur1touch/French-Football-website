import { Suspense } from "react";
import SearchClient from "@/components/search/SearchClient";

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Suspense fallback={null}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
