import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";

async function getData(categoryId: string, brandId: string){
  const category = await prismadb.allcategory.findUnique({
    where: {
      id: categoryId,
      type: "Category",
      brandId: brandId
    }
  });
  return category
}

const CategoryPage = async (
  props: {
    params: Promise<{ brandId: string, categoryId: string }>
  }
) => {
  const params = await props.params;
  const category = await getData(params.categoryId, params.brandId);
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} />
      </div>
    </div>
  );
}

export default CategoryPage;
