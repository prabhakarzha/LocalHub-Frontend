// src/hooks/useDataFetching.ts
import { useRef, useEffect } from "react";

type FetchFunction = () => Promise<void>;

// Module-level flag
let MODULE_LEVEL_FETCHED = false;

export function useDataFetching(fetchFn: FetchFunction, deps: any[] = []) {
  useEffect(() => {
    // ✅ Module flag check
    if (MODULE_LEVEL_FETCHED) {
      console.log("⏭️ Module level - already fetched, skipping...");
      return;
    }

    console.log("🆕 First time fetching - setting flags...");
    MODULE_LEVEL_FETCHED = true;

    const fetchData = async () => {
      try {
        await fetchFn();
      } catch (error) {
        console.error("Fetch error:", error);
        // Reset on error so retry possible
        MODULE_LEVEL_FETCHED = false;
      }
    };

    fetchData();

    // Cleanup - MODULE_LEVEL_FETCHED reset mat karo
  }, deps);
}
