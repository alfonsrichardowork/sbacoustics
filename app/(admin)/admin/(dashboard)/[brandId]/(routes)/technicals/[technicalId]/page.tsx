import prismadb from "@/lib/prismadb";
import { TechnicalForm } from "./components/technical-form";

async function getData(technicalId: string, brandId: string){
   const onetechnical = await prismadb.technicals.findUnique({
    where: {
      brandId,
      id: technicalId,
    }
  });

  const totalTechnical = await prismadb.technicals.findMany({
    where: {
      brandId 
    },
    select: {
      priority: true
    }
  })
  return [onetechnical, totalTechnical] as const;
}
const TechnicalPage = async (
  props: {
    params: Promise<{ technicalId: string, brandId: string }>
  }
) => {
  const params = await props.params;
  const [onetechnical, totalTechnical] = await getData(params.technicalId, params.brandId)
  const priority = totalTechnical.map((a) => a.priority)


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TechnicalForm 
          initialData={onetechnical} total={priority}
        />
      </div>
    </div>
  );
}

export default TechnicalPage;

