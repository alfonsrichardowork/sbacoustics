import { connection } from "next/server";
import prismadb from "@/lib/prismadb";
import { ChildSpecForm } from "./components/child-spec-form";
export const instant = false
async function getData(childSpecId: string){
  const child = await prismadb.dynamicspecification.findUnique({
    where: {
      id: childSpecId
    }
  });
  return child;
}

const ChildSpecPage = async (
  props: {
    params: Promise<{ childSpecId: string, brandId: string }>
  }
) => {
  await connection();
  const params = await props.params;
  const child = await getData(params.childSpecId)
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ChildSpecForm 
          initialData={child}
        />
      </div>
    </div>
  );
}

export default ChildSpecPage;
