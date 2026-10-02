import prismadb from "@/lib/prismadb";
import { CatalogueForm } from "./components/catalogue-form";
import { cacheLife } from "next/cache";
async function getData(catalogueId: string, brandId: string){
  const onecatalogue = await prismadb.catalogues.findUnique({
    where: {
      brandId,
      id: catalogueId,
    }
  });
  return onecatalogue
}

const CataloguePage = async (
  props: {
    params: Promise<{ catalogueId: string, brandId: string }>
  }
) => {
  const params = await props.params;
  const onecatalogue = await getData(params.catalogueId, params.brandId)

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

