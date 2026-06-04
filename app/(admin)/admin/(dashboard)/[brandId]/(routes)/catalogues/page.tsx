import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { CataloguesClient } from "./components/client";
import { CataloguesColumn } from "./components/columns";
import { getSession } from "@/lib/actions";

const CataloguesPage = async (
  props: {
    params: Promise<{ brandId: string }>
  }
) => {
  const params = await props.params;
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const allCatalogues = await prismadb.catalogues.findMany({
    where: {
      brandId: params.brandId
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  const formattedCatalogues: CataloguesColumn[] = allCatalogues.map((item) => ({
    id: item.id,
    name: item.pdfname,
    updatedAt: format(item.updatedAt, 'MMMM do, yyyy'),
    updatedBy: item.updatedBy
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CataloguesClient data={formattedCatalogues} userRole={session.isAdmin!}/>
      </div>
    </div>
  );
};

export default CataloguesPage;
