import prismadb from "@/lib/prismadb";
import { DistributorForm } from "./components/distributor-form";


// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;


const DistributorsPage = async (
  props: {
    params: Promise<{ distributorId: string }>
  }
) => {
  const params = await props.params;
  const dist = await prismadb.distributors.findFirst({
    where: {
      id: params.distributorId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DistributorForm initialData={dist}/>
      </div>
    </div>
  );
}

export default DistributorsPage;
