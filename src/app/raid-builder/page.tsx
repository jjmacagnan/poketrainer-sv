"use client";

import { Suspense } from "react";
import { RaidBuildMaker } from "@/components/raid/RaidBuildMaker";

export default function RaidBuilderPage() {
  return (
    <Suspense>
      <RaidBuildMaker />
    </Suspense>
  );
}
