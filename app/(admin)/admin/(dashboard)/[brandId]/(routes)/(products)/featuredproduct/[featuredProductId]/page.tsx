import prismadb from "@/lib/prismadb";
import { FeaturedProductForm } from "./components/featured-product-form";

async function getData(featuredProductId: string, brandId: string){
  const product = await prismadb.product.findUnique({
    where: {
      id: featuredProductId,
      brandId: brandId
    }
  });
  return product
}

const FeaturedProductPage = async (
  props: {
    params: Promise<{ brandId: string, featuredProductId: string }>
  }
) => {
  const params = await props.params;
  const product = await getData(params.featuredProductId, params.brandId);
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FeaturedProductForm 
          initialData={product}
        />
      </div>
    </div>
  );
}

export default FeaturedProductPage;

