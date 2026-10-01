import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import { ParentSpecColumn } from "./components/columns";
import { ParentSpecClient } from "./components/client";

async function getData(){
   const parentspec = await prismadb.dynamicspecificationparent.findMany({
    orderBy: {
      updatedAt: 'desc'
    }
  });
  return parentspec
}
const ParentSpecPage = async (
) => {
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const parentspec = await getData()
  const formattedParentSpec: ParentSpecColumn[] = parentspec.map((item) => ({
    id: item.id,
    name: item.name,
    updatedAt: format(item.updatedAt, 'MMMM do, yyyy'),
    updatedBy: item.updatedBy,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ParentSpecClient data={formattedParentSpec}/>
      </div>
    </div>
  );
};

export default ParentSpecPage;
