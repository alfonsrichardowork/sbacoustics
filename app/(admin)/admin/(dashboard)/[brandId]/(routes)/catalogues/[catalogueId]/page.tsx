import prismadb from "@/lib/prismadb";
import { CatalogueForm } from "./components/catalogue-form";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

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

