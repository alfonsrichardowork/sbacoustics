import prismadb from "@/lib/prismadb";
import { CatalogueForm } from "./components/catalogue-form";
import { cacheLife } from "next/cache";
async function getData(catalogueId: string){
  const onecatalogue = await prismadb.catalogues.findUnique({
    where: {
      id: catalogueId,
    }
  });
  return onecatalogue
}

const CataloguePage = async (
  props: {
    params: Promise<{ catalogueId: string }>
  }
) => {
  const params = await props.params;
  const onecatalogue = await getData(params.catalogueId)

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CatalogueForm 
          initialData={onecatalogue}
        />
      </div>
    </div>
  );
}

export default CataloguePage;

