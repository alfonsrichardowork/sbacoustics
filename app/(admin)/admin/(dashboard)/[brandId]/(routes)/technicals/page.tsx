import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { TechnicalsClient } from "./components/client";
import { TechnicalsColumn } from "./components/columns";
import { getSession } from "@/lib/actions";

const TechnicalsPage = async (
  props: {
    params: Promise<{ brandId: string }>
  }
) => {
  const params = await props.params;
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const alltechnicals = await prismadb.technicals.findMany({
    where:{
      brandId: params.brandId
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  const formattedTechnicals: TechnicalsColumn[] = alltechnicals.map((item) => ({
    id: item.id,
    name: item.name,
    updatedAt: format(item.updatedAt, 'MMMM do, yyyy'),
    updatedBy: item.updatedBy
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TechnicalsClient data={formattedTechnicals} userRole={session.isAdmin!}/>
      </div>
    </div>
  );
};

export default TechnicalsPage;
