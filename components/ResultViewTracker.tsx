"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";
import type { DistanceKey } from "@/lib/distance";

interface Props {
  fromKey: DistanceKey;
  toKey: DistanceKey;
}

/** Fires once per mount — ResultView itself stays a Server Component. */
export default function ResultViewTracker({ fromKey, toKey }: Props) {
  useEffect(() => {
    track("result_view", { from: fromKey, to: toKey });
  }, [fromKey, toKey]);

  return null;
}
