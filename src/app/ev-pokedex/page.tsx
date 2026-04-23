"use client";

import { Suspense } from "react";
import { EVPokedex } from "@/components/ev/EVPokedex";

export default function EVPokedexPage() {
  return (
    <Suspense>
      <EVPokedex />
    </Suspense>
  );
}
