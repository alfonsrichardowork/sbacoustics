import prismadb from "@/lib/prismadb";
import { AllProductCategoryForm } from "./components/categories-form";

async function getData(brandId: string, productId: string){
  const categories = await prismadb.allcategory.findMany({
    where: {
      type: "Category",
      brandId : brandId
    },
  });

  const subcategories = await prismadb.allcategory.findMany({
    where: {
      type: "Sub Category",
      brandId : brandId
    },
  });

  const subsubcategories = await prismadb.allcategory.findMany({
    where: {
      type: "Sub Sub Category",
      brandId : brandId
    },
  });
  const allproductcategories = await prismadb.allproductcategory.findMany({
    where: {
      productId: productId,
    },
    include:{
      category: true
     }
  });

  const myproduct = await prismadb.product.findFirst({
    where: {
      id: productId,
      brandId: brandId
    },
  });
  return [categories, subcategories, subsubcategories, allproductcategories, myproduct] as const;
}

const AllProductCategoryPage = async (
  props: {
    params: Promise<{ productId: string, brandId: string }>
  }
) => {
  const params = await props.params;
  const [categories, subcategories, subsubcategories, allproductcategories, myproduct] = await getData(params.brandId, params.productId)  
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
