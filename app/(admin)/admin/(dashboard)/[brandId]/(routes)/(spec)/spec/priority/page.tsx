import prismadb from "@/lib/prismadb";
import { PriorityForm } from "./components/priority-form";

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
