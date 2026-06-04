import prismadb from "@/lib/prismadb";
import { ProductUsedInKitsForm } from "./components/product-used-in-kits-form";


const ProductUsedInKitsPage = async (
  props: {
    params: Promise<{ productId: string, brandId: string }>
  }
) => {
  const params = await props.params;

  const productUsedinKits = await prismadb.productsusedinkits.findMany({
    where: {
      productId: params.productId,
    },
  });

  const myproduct = await prismadb.product.findFirst({
    where: {
      brandId: params.brandId,
      id: params.productId,
    },
  });

  const allproducts = await prismadb.product.findMany({
    where:{
      brandId: params.brandId,
      id: {
        not: params.productId
      }
    },
  });

  const updatedProducts = allproducts.map(product => ({
    ...product,
    name: product.name.replace(/["“”‟″‶〃״˝ʺ˶ˮײ']/g, ' inch')
  }));
  if(myproduct){
    return ( 
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ProductUsedInKitsForm 
            initialData={productUsedinKits}
            initialProduct={myproduct!}
            allProducts={updatedProducts}
          />
        </div>
      </div>
    );
  }
  return null
}

export default ProductUsedInKitsPage;
