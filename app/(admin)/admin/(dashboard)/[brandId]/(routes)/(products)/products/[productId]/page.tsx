import prismadb from "@/lib/prismadb";

import { ProductForm } from "./components/product-form";

async function getData(productId: string, brandId: string){
  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
      brandId: brandId
    },
    include: {
      images_catalogues: true,
      multipleDatasheetProduct: true,
      multipleFRDZMAFiles: true,
      multiple3DModels: true
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      brandId: brandId,
    },
  });
  return [product, sizes] as const;
}

const ProductPage = async (
  props: {
    params: Promise<{ productId: string, brandId: string }>
  }
) => {
  const params = await props.params;
  const [product, sizes] = await getData(params.productId, params.brandId)
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          initialData={product}
          sizes={sizes}
        />
      </div>
    </div>
  );
}

export default ProductPage;
