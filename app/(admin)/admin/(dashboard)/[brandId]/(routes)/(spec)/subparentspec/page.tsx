import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import { SubParentSpecColumn } from "./components/columns";
import { SubParentSpecClient } from "./components/client";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const SubParentSpecPage = async (
) => {
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const subparentspec = await prismadb.dynamicspecificationsubparent.findMany({
    orderBy: {
      updatedAt: 'desc'
    }
  });

  const formattedSubParentSpec: SubParentSpecColumn[] = subparentspec.map((item) => ({
    id: item.id,
    name: item.name,
    updatedAt: format(item.updatedAt, 'MMMM do, yyyy'),
    updatedBy: item.updatedBy,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubParentSpecClient data={formattedSubParentSpec}/>
      </div>
    </div>
  );
};

export default SubParentSpecPage;
