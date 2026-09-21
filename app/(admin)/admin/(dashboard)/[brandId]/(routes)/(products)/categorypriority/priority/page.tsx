import prismadb from "@/lib/prismadb";
import { PriorityForm } from "./components/priority-form";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const DynamicCategoryPriorityPage = async (props: {
    params: Promise<{ brandId: string }>
  }) => {
    const all = await prismadb.allcategory.findMany({
      where: {
        shown_on_all_drivers_page: true,
        brandId: (await props.params).brandId
      }
    })
  

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PriorityForm allCat={all} />
      </div>
    </div>
  );
}

export default DynamicCategoryPriorityPage;
