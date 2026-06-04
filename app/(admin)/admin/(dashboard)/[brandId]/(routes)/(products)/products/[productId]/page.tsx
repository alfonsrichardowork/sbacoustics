import prismadb from "@/lib/prismadb";

import { ProductForm } from "./components/product-form";

const ProductPage = async (
  props: {
    params: Promise<{ productId: string, brandId: string }>
  }
) => {
  const params = await props.params;
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
      brandId: params.brandId
    },
    include: {
      images_catalogues: true,
      multipleDatasheetProduct: true,
      multipleFRDZMAFiles: true,
      multiple3DModels: true
      // specification: true,
      // image_cover: true,
      // datasheet: true,
    },
  });

  // const local_datasheet = await prismadb.multipleDatasheetProduct.findMany({
  //   where:{
  //     productId: params.productId
  //   }
  // })

  const sizes = await prismadb.size.findMany({
    where: {
      brandId: params.brandId,
    },
  });

  // const specification = await prismadb.specification.findFirst({
  //   where: {
  //     id: params.productId,
  //   },
  // });
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          initialData={product}
          // datasheet_local = {local_datasheet}
          // categories={categories} 
          // subcategories={subcategories} 
          // subsubcategories={subsubcategories} 
          // specification={specification!}
          sizes={sizes}
        />
      </div>
    </div>
  );
}

export default ProductPage;
