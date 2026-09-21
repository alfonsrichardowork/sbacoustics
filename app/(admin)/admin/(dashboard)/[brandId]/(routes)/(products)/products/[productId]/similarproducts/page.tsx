import prismadb from "@/lib/prismadb";
import { SimiliarProductForm } from "./components/similar-product-form";


// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;


const SimilarProductPage = async (
  props: {
    params: Promise<{ productId: string, brandId: string }>
  }
) => {
  const params = await props.params;

  const allsimilarproducts = await prismadb.similarproducts.findMany({
    where: {
      productId: params.productId,
    },
  });

  const myproduct = await prismadb.product.findFirst({
    where: {
      id: params.productId,
      brandId: params.brandId
    },
  });

  const allproducts = await prismadb.product.findMany({
    where:{
      brandId: params.brandId,
      id: {
        not: params.productId
      }
    }
  });

  const updatedProducts = allproducts.map(product => ({
    ...product,
    name: product.name.replace(/["“”‟″‶〃״˝ʺ˶ˮײ']/g, ' inch')
  }));
  if(myproduct){
    return ( 
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <SimiliarProductForm 
            initialData={allsimilarproducts}
            initialProduct={myproduct!}
            allProducts={updatedProducts}
          />
        </div>
      </div>
    );
  }
  return null
}

export default SimilarProductPage;
