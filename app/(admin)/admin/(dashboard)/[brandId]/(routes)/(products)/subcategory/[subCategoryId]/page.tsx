import prismadb from "@/lib/prismadb";

import { SubCategoryForm } from "./components/sub-category-form";

const SubCategoryPage = async (
  props: {
    params: Promise<{ brandId: string, subCategoryId: string }>
  }
) => {
  const params = await props.params;
  const Subcategory = await prismadb.allcategory.findUnique({
    where: {
      id: params.subCategoryId,
      type: "Sub Category",
      brandId: params.brandId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubCategoryForm initialData={Subcategory} />
      </div>
    </div>
  );
}

export default SubCategoryPage;
