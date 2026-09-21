import prismadb from "@/lib/prismadb";
import { FinishingForm } from "./components/finishing-form";


// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;


const AllFinishingPage = async (
  props: {
    params: Promise<{ finishingId: string }>
  }
) => {
  const params = await props.params;
  const dist = await prismadb.allfinishing.findFirst({
    where: {
      id: params.finishingId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FinishingForm initialData={dist}/>
      </div>
    </div>
  );
}

export default AllFinishingPage;
