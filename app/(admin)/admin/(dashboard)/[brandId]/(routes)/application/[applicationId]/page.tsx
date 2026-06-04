import prismadb from "@/lib/prismadb";
import { ApplicationForm } from "./components/application-form";


const ApplicationPage = async (
  props: {
    params: Promise<{ applicationId: string, brandId: string }>
  }
) => {
  const params = await props.params;
  const app = await prismadb.sbaudienceapplication.findUnique({
    where: {
      id: params.applicationId,
      brandId: params.brandId
    },
    include: {
      images_catalogues: true,
      datasheet: true,
    },
  });

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
