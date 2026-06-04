import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { SubCategoryColumn } from "./components/columns";
import { SubCategoriesClient } from "./components/client";
import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";

const SubCategoryPage = async (
  props: {
    params: Promise<{ brandId: string }>
  }
) => {
  const params = await props.params;
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const subcategory = await prismadb.allcategory.findMany({
    where: {
      brandId: params.brandId,
      type: "Sub Category"
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  const formattedSubCategories: SubCategoryColumn[] = subcategory.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    updatedBy: item.updatedBy,
    updatedAt: format(item.updatedAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubCategoriesClient data={formattedSubCategories} userRole={session.isAdmin!}/>
      </div>
    </div>
  );
};

export default SubCategoryPage;
