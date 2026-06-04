import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { SubSubCategoryColumn } from "./components/columns";
import { SubSubCategoriesClient } from "./components/client";
import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";

const SubSubCategoryPage = async (
  props: {
    params: Promise<{ brandId: string }>
  }
) => {
  const params = await props.params;
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const subsubcategory = await prismadb.allcategory.findMany({
    where: {
      brandId: params.brandId,
      type: "Sub Sub Category"
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  const formattedSubSubCategories: SubSubCategoryColumn[] = subsubcategory.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    updatedBy: item.updatedBy,
    updatedAt: format(item.updatedAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubSubCategoriesClient data={formattedSubSubCategories} userRole={session.isAdmin!}/>
      </div>
    </div>
  );
};

export default SubSubCategoryPage;
