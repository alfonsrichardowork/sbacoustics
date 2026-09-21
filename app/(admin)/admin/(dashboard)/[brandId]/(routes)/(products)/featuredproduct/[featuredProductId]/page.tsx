import prismadb from "@/lib/prismadb";
import { FeaturedProductForm } from "./components/featured-product-form";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const FeaturedProductPage = async (
  props: {
    params: Promise<{ brandId: string, featuredProductId: string }>
  }
) => {
  const params = await props.params;
  const product = await prismadb.product.findUnique({
    where: {
      id: params.featuredProductId,
      brandId: params.brandId
    }
  });

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

