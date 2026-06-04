import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { ProductsClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";

const ProductsPage = async (
  props: {
    params: Promise<{ brandId: string }>
  }
) => {
  const params = await props.params;
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const products = await prismadb.product.findMany({
    where: {
      brandId: params.brandId
    },
    include: {
      images_catalogues: true,
      size: true,
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    desc: item.description,
    productImageUrl: item.cover_img_url,
    isKits: item.isKits,
    size: item.size.name,
    updatedAt: format(item.updatedAt, 'MMMM do, yyyy'),
    updatedBy: item.updatedBy,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} userRole={session.isAdmin!}/>
      </div>
    </div>
  );
};

export default ProductsPage;
