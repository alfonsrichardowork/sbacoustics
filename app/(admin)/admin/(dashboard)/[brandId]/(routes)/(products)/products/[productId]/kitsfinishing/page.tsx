import prismadb from "@/lib/prismadb";
import { KitsFinishingForm } from "./components/kits-finishing-form";


// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;


const UserPage = async (
    props: {
      params: Promise<{ brandId: string, productId: string }>
    }
) => {
    const params = await props.params;
    const kits_finishing_data = await prismadb.kitsfinishing.findMany({
        where: {
          productId: params.productId,
        },
    });

    const name_product = await prismadb.product.findFirst({
        where:{
            id: params.productId,
            brandId: params.brandId
        },
        select:{
            name: true
        }
    })

    const all_finishing = await prismadb.allfinishing.findMany({})

    if(!kits_finishing_data){
        return null;
    }

    if(!name_product){
        return null;
    }

    if(!all_finishing){
        return null;
    }

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <KitsFinishingForm initialData={kits_finishing_data} name={name_product.name} allFinishing={all_finishing}/>
            </div>
        </div>
  );
}

export default UserPage;
