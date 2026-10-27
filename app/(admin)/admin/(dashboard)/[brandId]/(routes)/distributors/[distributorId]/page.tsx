import { connection } from "next/server";
import prismadb from "@/lib/prismadb";
import { DistributorForm } from "./components/distributor-form";
export const instant = false

async function getData(distributorId: string){
  const dist = await prismadb.distributors.findFirst({
    where: {
      id: distributorId
    }
  });
  return dist
}

const DistributorsPage = async (
  props: {
    params: Promise<{ distributorId: string }>
  }
) => {
  await connection();
  const params = await props.params;
  const dist = await getData(params.distributorId)
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DistributorForm initialData={dist}/>
      </div>
    </div>
  );
}

export default DistributorsPage;
