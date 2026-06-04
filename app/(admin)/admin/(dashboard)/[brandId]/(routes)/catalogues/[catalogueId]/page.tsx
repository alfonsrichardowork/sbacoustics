import prismadb from "@/lib/prismadb";
import { CatalogueForm } from "./components/catalogue-form";

const CataloguePage = async (
  props: {
    params: Promise<{ catalogueId: string }>
  }
) => {
  const params = await props.params;
  const onecatalogue = await prismadb.catalogues.findUnique({
    where: {
      id: params.catalogueId,
    }
  });


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

