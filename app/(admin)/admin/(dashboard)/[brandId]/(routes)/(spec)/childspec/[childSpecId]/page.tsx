import prismadb from "@/lib/prismadb";
import { ChildSpecForm } from "./components/child-spec-form";


// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;


const ChildSpecPage = async (
  props: {
    params: Promise<{ childSpecId: string, brandId: string }>
  }
) => {
  const params = await props.params;
  const child = await prismadb.dynamicspecification.findUnique({
    where: {
      id: params.childSpecId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ChildSpecForm 
          initialData={child}
        />
      </div>
    </div>
  );
}

export default ChildSpecPage;
