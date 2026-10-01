import prismadb from "@/lib/prismadb";
import { PriorityForm } from "./components/priority-form";

async function getData(brandId: string){
  const all = await prismadb.allcategory.findMany({
    where: {
      shown_on_all_drivers_page: true,
      brandId: brandId
    }
  })
  return all
}

const DynamicCategoryPriorityPage = async (props: {
    params: Promise<{ brandId: string }>
  }) => {
  const all = await getData((await props.params).brandId)
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PriorityForm allCat={all} />
      </div>
    </div>
  );
}

export default DynamicCategoryPriorityPage;
