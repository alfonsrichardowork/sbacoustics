import prismadb from "@/lib/prismadb";
import { ParentSpecForm } from "./components/parent-spec-form";


// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;


const ParentSpecPage = async (
  props: {
    params: Promise<{ parentSpecId: string, brandId: string }>
  }
) => {
  const params = await props.params;
  const parent = await prismadb.dynamicspecificationparent.findUnique({
    where: {
      id: params.parentSpecId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ParentSpecForm 
          initialData={parent}
        />
      </div>
    </div>
  );
}

export default ParentSpecPage;
