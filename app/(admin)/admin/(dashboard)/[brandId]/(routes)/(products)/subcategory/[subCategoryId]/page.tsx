import prismadb from "@/lib/prismadb";

import { SubCategoryForm } from "./components/sub-category-form";

async function getData(subCategoryId: string, brandId: string){
  const Subcategory = await prismadb.allcategory.findUnique({
    where: {
      id: subCategoryId,
      type: "Sub Category",
      brandId: brandId
    }
  });

  const categories = await prismadb.allcategory.findMany({
    where: {
      type: {
        in: ["Category", "Sub Category"]
      },
      brandId : brandId,
      id: {
        not: subCategoryId
      }
    },
  });

  return [Subcategory, categories] as const;
}

const SubCategoryPage = async (
  props: {
    params: Promise<{ brandId: string, subCategoryId: string }>
  }
) => {
  const params = await props.params;
  const [Subcategory, categories] = await getData(params.subCategoryId, params.brandId)
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubCategoryForm initialData={Subcategory} categories={categories} />
      </div>
    </div>
  );
}

export default SubCategoryPage;
