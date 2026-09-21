import prismadb from "@/lib/prismadb";
import { PriorityForm } from "./components/priority-form";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const DynamicSpecPriorityPage = async (props: {
    params: Promise<{ brandId: string }>
  }) => {
  let allCat: string[] = ["Parent", "SubParent", "Child"]
  const allParent = await prismadb.dynamicspecificationparent.findMany({})
  const allSubParent = await prismadb.dynamicspecificationsubparent.findMany({})
  const allChild = await prismadb.dynamicspecification.findMany({})
  

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PriorityForm 
          allCat = {allCat}
          allParent={allParent}
          allSubParent={allSubParent}
          allChild={allChild}
        />
      </div>
    </div>
  );
}

export default DynamicSpecPriorityPage;
