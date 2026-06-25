
import { DistributorMapWrapper } from "@/components/distributorMapWrapper";
import prismadb from "@/lib/prismadb";

export const revalidate = 3600;

export default async function DistributorPage() {
  const asianDistributors = await prismadb.distributors.findMany({
  where: {
    continent: "Asia",
    brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
  },
  orderBy: [
    { country: "asc" },
    { name: "asc" },
  ],
});

  const europeDistributors = await prismadb.distributors.findMany({
    where: { continent: "Europe", brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID },
    orderBy: [
      { country: "asc" },
      { name: "asc" },
    ],
  });

  const americaDistributors = await prismadb.distributors.findMany({
    where: { continent: "The Americas", brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID },
    orderBy: [
      { country: "asc" },
      { name: "asc" },
    ],
  });

  const oceaniaDistributors = await prismadb.distributors.findMany({
    where: { continent: "Oceania", brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID },
    orderBy: [
      { country: "asc" },
      { name: "asc" },
    ],
  });

  const africaDistributors = await prismadb.distributors.findMany({
    where: { continent: "Africa", brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID },
    orderBy: [
      { country: "asc" },
      { name: "asc" },
    ],
  });

  const antarticaDistributors = await prismadb.distributors.findMany({
    where: { continent: "Antartica", brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID },
    orderBy: [
      { country: "asc" },
      { name: "asc" },
    ],
  });

  return (
    <DistributorMapWrapper
      asianDistributors={asianDistributors}
      europeDistributors={europeDistributors}
      americaDistributors={americaDistributors}
      oceaniaDistributors={oceaniaDistributors}
      africaDistributors={africaDistributors}
      antarticaDistributors={antarticaDistributors}
    />
  );
}