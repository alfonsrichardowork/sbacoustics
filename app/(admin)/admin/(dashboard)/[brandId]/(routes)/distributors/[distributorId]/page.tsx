import prismadb from "@/lib/prismadb";
import { DistributorForm } from "./components/distributor-form";


const DistributorsPage = async (
  props: {
    params: Promise<{ distributorId: string }>
  }
) => {
  const params = await props.params;
  const dist = await prismadb.distributors.findFirst({
    where: {
      id: params.distributorId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DistributorForm initialData={dist}/>
      </div>
    </div>
  );
}

export default DistributorsPage;
