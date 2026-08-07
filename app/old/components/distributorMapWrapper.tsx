"use client";

import dynamic from "next/dynamic";
import { distributors } from "@prisma/client";
import { Loader2 } from "lucide-react";

interface DistributorProps {
  asianDistributors: distributors[];
  europeDistributors: distributors[];
  americaDistributors: distributors[];
  oceaniaDistributors: distributors[];
  africaDistributors: distributors[];
  antarticaDistributors: distributors[];
}

const DistributorMap = dynamic(
  () => import("./MapComponent").then((mod) => ({ default: mod.DistributorMap })),
  {
    ssr: false,
    loading: () => (
      <>
      </>
    ),
  }
);

export function DistributorMapWrapper(props: DistributorProps) {
  return <DistributorMap {...props} />;
}