import prismadb from "@/lib/prismadb";
import { FinishingForm } from "./components/finishing-form";

async function getData(finishingId: string){
  const dist = await prismadb.allfinishing.findFirst({
    where: {
      id: finishingId
    }
  });
  return dist
}

const AllFinishingPage = async (
  props: {
    params: Promise<{ finishingId: string }>
  }
) => {
  const params = await props.params;
  const dist = await getData(params.finishingId)
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FinishingForm initialData={dist}/>
      </div>
    </div>
  );
}

export default AllFinishingPage;
