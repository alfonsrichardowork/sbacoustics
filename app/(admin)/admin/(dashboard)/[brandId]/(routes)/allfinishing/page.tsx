import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions";
import { FinishingClient } from "./components/client";
import { FinishingColumn } from "./components/columns";
import { format } from "date-fns";

const AllFinishingPage = async (
  props: {
    params: Promise<{ brandId: string }>
  }
) => {
  const params = await props.params;
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const allFinish = await prismadb.allfinishing.findMany({
    where: {
      brandId: params.brandId
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  if (!allFinish) {
    redirect(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/`);
  }
  
  const formattedAllFinishing: FinishingColumn[] = allFinish.map((oneFinish) => ({
    id: oneFinish.id,
    name: oneFinish.name,
    updatedBy: oneFinish.updatedBy,
    updatedAt: format(oneFinish.updatedAt, 'MMMM do, yyyy'),
  }));

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FinishingClient data={formattedAllFinishing} />
      </div>
    </div>
  );
};

export default AllFinishingPage;
