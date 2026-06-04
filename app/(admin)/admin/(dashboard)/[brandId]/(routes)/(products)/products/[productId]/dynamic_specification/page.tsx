import prismadb from "@/lib/prismadb";
import { SpecForm } from "./components/dynamic_specification_form";


const SBAudienceDynamicSpecPage = async (
  props: {
    params: Promise<{ productId: string, brandId: string }>
  }
) => {
  const params = await props.params;

  const allParentSpec = await prismadb.dynamicspecificationparent.findMany({})
  const allSubParentSpec = await prismadb.dynamicspecificationsubparent.findMany({})
  const allChildSpec = await prismadb.dynamicspecification.findMany({})
  const initial = await prismadb.specificationconnector.findMany({
    where: {
      brandId: params.brandId,
      productId: params.productId
    }
  })
  const productName = await prismadb.product.findFirst({
    where: {
      brandId: params.brandId,
      id: params.productId
    },
    select:{
      name: true
    }
  })

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SpecForm initialData={initial} allParentSpec={allParentSpec} allSubParentSpec={allSubParentSpec} allChildSpec={allChildSpec} productName={productName?.name ?? ''}/>
      </div>
    </div>
  );
}

export default SBAudienceDynamicSpecPage;
