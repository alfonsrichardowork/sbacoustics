import prismadb from "@/lib/prismadb";
import { ApplicationForm } from "./components/application-form";

async function getData(applicationId: string, brandId: string){
  const app = await prismadb.sbaudienceapplication.findUnique({
    where: {
      id: applicationId,
      brandId: brandId
    },
    include: {
      images_catalogues: true,
      datasheet: true,
    },
  });
  return app
}

const ApplicationPage = async (
  props: {
    params: Promise<{ applicationId: string, brandId: string }>
  }
) => {
  const params = await props.params;
  const app = await getData(params.applicationId, params.brandId)
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ApplicationForm 
          initialData={app}
        />
      </div>
    </div>
  );
}

export default ApplicationPage;
