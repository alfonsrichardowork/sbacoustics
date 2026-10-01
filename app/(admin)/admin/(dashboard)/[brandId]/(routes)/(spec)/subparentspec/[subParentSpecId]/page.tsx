import prismadb from "@/lib/prismadb";
import { SubParentSpecForm } from "./components/sub-parent-spec-form";

async function getData(subParentSpecId: string){
  const subparent = await prismadb.dynamicspecificationsubparent.findUnique({
    where: {
      id: subParentSpecId
    }
  });
  return subparent
}
const SubParentSpecPage = async (
  props: {
    params: Promise<{ subParentSpecId: string, brandId: string }>
  }
) => {
  const params = await props.params;
  const subparent = await getData(params.subParentSpecId)
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubParentSpecForm 
          initialData={subparent}
        />
      </div>
    </div>
  );
}

export default SubParentSpecPage;
