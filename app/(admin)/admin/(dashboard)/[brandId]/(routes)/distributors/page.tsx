import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions";
import { DistributorsClient } from "./components/client";
import { DistributorsColumn } from "./components/columns";
import { format } from "date-fns";

const DistributorsPage = async (
  props: {
    params: Promise<{ brandId: string }>
  }
) => {
  const params = await props.params;
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const distributor = await prismadb.distributors.findMany({
    where: {
      brandId: params.brandId
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  if (!distributor) {
    redirect(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/`);
  }
  
  const formattedDistributors: DistributorsColumn[] = distributor.map((oneDistributor) => ({
    id: oneDistributor.id,
    name: oneDistributor.name,
    updatedBy: oneDistributor.updatedBy,
    updatedAt: format(oneDistributor.updatedAt, 'MMMM do, yyyy'),
  }));

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DistributorsClient data={formattedDistributors} />
      </div>
    </div>
  );
};

export default DistributorsPage;
