import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { AppColumn } from "./components/columns";
import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import { AppClient } from "./components/client";

const ApplicationPage = async (
  props: {
    params: Promise<{ brandId: string }>
  }
) => {
  const params = await props.params;
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const app = await prismadb.sbaudienceapplication.findMany({
    where: {
      brandId: params.brandId
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  const formattedApps: AppColumn[] = app.map((item) => ({
    id: item.id,
    name: item.name,
    updatedAt: format(item.updatedAt, 'MMMM do, yyyy'),
    updatedBy: item.updatedBy,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AppClient data={formattedApps}/>
      </div>
    </div>
  );
};

export default ApplicationPage;
