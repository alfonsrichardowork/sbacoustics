import prismadb from "@/lib/prismadb";
import { SimiliarProductForm } from "./components/similar-product-form";

async function getData(productId: string, brandId: string){
  const allsimilarproducts = await prismadb.similarproducts.findMany({
    where: {
      productId: productId,
    },
  });

  const myproduct = await prismadb.product.findFirst({
    where: {
      id: productId,
      brandId: brandId
    },
  });

  const allproducts = await prismadb.product.findMany({
    where:{
      brandId: brandId,
      id: {
        not: productId
      }
    }
  });
  return [allsimilarproducts, myproduct, allproducts] as const;
}

const SimilarProductPage = async (
  props: {
    params: Promise<{ productId: string, brandId: string }>
  }
) => {
  const params = await props.params;
  const [allsimilarproducts, myproduct, allproducts] = await getData(params.productId, params.brandId)
  

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
