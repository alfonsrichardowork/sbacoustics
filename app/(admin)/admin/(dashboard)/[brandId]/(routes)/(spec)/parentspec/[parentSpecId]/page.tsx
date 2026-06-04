import prismadb from "@/lib/prismadb";
import { ParentSpecForm } from "./components/parent-spec-form";


const ParentSpecPage = async (
  props: {
    params: Promise<{ parentSpecId: string, brandId: string }>
  }
) => {
  const params = await props.params;
  const parent = await prismadb.dynamicspecificationparent.findUnique({
    where: {
      id: params.parentSpecId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ParentSpecForm 
          initialData={parent}
        />
      </div>
    </div>
  );
}

export default ParentSpecPage;
