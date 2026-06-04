import prismadb from "@/lib/prismadb";
import { AllProductCategoryForm } from "./components/categories-form";


const AllProductCategoryPage = async (
  props: {
    params: Promise<{ productId: string, brandId: string }>
  }
) => {
  const params = await props.params;
  const categories = await prismadb.allcategory.findMany({
    where: {
      type: "Category",
      brandId : params.brandId
    },
  });

  const subcategories = await prismadb.allcategory.findMany({
    where: {
      type: "Sub Category",
      brandId : params.brandId
    },
  });

  const subsubcategories = await prismadb.allcategory.findMany({
    where: {
      type: "Sub Sub Category",
      brandId : params.brandId
    },
  });

  const allproductcategories = await prismadb.allproductcategory.findMany({
    where: {
      productId: params.productId,
    },
    include:{
      category: true
     }
  });

  const myproduct = await prismadb.product.findFirst({
    where: {
      id: params.productId,
      brandId: params.brandId
    },
  });
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AllProductCategoryForm 
          initialData={allproductcategories}
          categories={categories}
          subcategories={subcategories}
          subsubcategories={subsubcategories}
          myproduct={myproduct!}
        />
      </div>
    </div>
  );
}

export default AllProductCategoryPage;
