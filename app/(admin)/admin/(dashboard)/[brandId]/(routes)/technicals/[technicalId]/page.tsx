import prismadb from "@/lib/prismadb";
import { TechnicalForm } from "./components/technical-form";

const TechnicalPage = async (
  props: {
    params: Promise<{ technicalId: string }>
  }
) => {
  const params = await props.params;
  const onetechnical = await prismadb.technicals.findUnique({
    where: {
      id: params.technicalId,
    }
  });


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TechnicalForm 
          initialData={onetechnical}
        />
      </div>
    </div>
  );
}

export default TechnicalPage;

