import prismadb from "@/lib/prismadb";

import { SubSubCategoryForm } from "./components/sub-sub-category-form";

async function getData(brandId: string, subSubCategoryId: string){
  const subsubcategory = await prismadb.allcategory.findUnique({
    where: {
      id: subSubCategoryId,
      type: "Sub Sub Category",
      brandId: brandId
    }
  });
  const categories = await prismadb.allcategory.findMany({
    where: {
      type: {
        in: ["Category", "Sub Category", "Sub Sub Category"]
      },
      brandId : brandId,
      id: {
        not: subSubCategoryId
      }
    },
  });

  return [subsubcategory, categories] as const;
}

const SubSubCategoryPage = async (
  props: {
    params: Promise<{ brandId: string, subSubCategoryId: string }>
  }
) => {
  const params = await props.params;
  const [subsubcategory, categories] = await getData(params.brandId, params.subSubCategoryId)
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubSubCategoryForm initialData={subsubcategory} categories={categories} />
      </div>
    </div>
  );
}

export default SubSubCategoryPage;
