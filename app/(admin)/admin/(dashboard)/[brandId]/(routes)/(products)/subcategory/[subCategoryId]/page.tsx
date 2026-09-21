import prismadb from "@/lib/prismadb";

import { SubCategoryForm } from "./components/sub-category-form";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

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

  const categories = await prismadb.allcategory.findMany({
    where: {
      type: {
        in: ["Category", "Sub Category"]
      },
      brandId : params.brandId,
      id: {
        not: params.subCategoryId
      }
    },
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubCategoryForm initialData={Subcategory} categories={categories} />
      </div>
    </div>
  );
}

export default SubCategoryPage;
