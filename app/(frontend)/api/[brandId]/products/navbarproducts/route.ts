// import { PriorityMenu } from "@/app/(frontend)/types";
// import prismadb from "@/lib/prismadb";
// import { NextResponse } from "next/server";

// function shortenMaterial(name: string): string {
//   return name
//     .replace(/Polypropylene/gi, "Poly")
//     // .replace(/Satori /gi, "")
//     .replace(/Aluminum/gi, "Alu");
// }

// export async function GET(req: Request, props: { params: Promise<{ brandId: string }> }) {
//   const params = await props.params;
//   try {
//     if (!params.brandId) {
//       return new NextResponse("brand id is required", { status: 400 });
//     }

//     const products = await prismadb.product.findMany({
//       where: {
//         brandId: params.brandId,
//         isArchived: false,
//       },
//       select:{
//           name: true,
//           slug: true,
//           id: true,
//           navbarNotes: true,
//           priority: true,
//           size: true,
//           isNewProduct: true,
//       }
//     });


//     const priority = await prismadb.menuPriority.findMany({})

//     const productIds = products.map(product => product.id);

//     const categories = await prismadb.allProductCategory.findMany({
//       where:{
//           productId:{
//               in: productIds
//           }
//       },
//       select:{
//           categoryId: true,
//           type: true,
//           name: true,
//           productId: true
//       }
//     })

//     const image_url = await prismadb.cover_Image.findMany({
//       select:{
//         productId: true,
//         url: true
//       }
//     })
    
//   const productsWithCategoriesandImage = products.map(product => {
//       const productCategories = categories.filter(category => category.productId === product.id);
      
//       const categoryDetails = productCategories.map(category => ({
//       type: category.type,
//       name: category.name,
//       }));

//       const productImage = image_url.filter(image => image.productId === product.id);
      

//       const final_Url = productImage.map(url => ({
//        url: url.url
//       }));
  
//       return {
//         productName: shortenMaterial(product.name),
//         productSlug: product.slug,
//         categories: categoryDetails,
//         url: final_Url,
//         navbarNotes: product.navbarNotes,
//         priority: product.priority,
//         newProd: product.isNewProduct,
//         size: product.size.name
//       };
//   });

//   let finalPriority : PriorityMenu[] = []
//   priority.map((val) =>{
//     let temp : PriorityMenu = {
//       priorityId: val.id,
//       categoryId: val.categoryId,
//       categoryName: categories.find((cat) => cat.categoryId === val.categoryId)?.name ?? '',
//       priority: val.priorityNumber,
//       menuType: categories.find((cat) => cat.categoryId === val.categoryId)?.type ?? '',
//       productId: val.productId,
//       productName: shortenMaterial(products.find((prod) => prod.id === val.productId)?.name ?? '')
//     }
//     finalPriority.push(temp)
//   })


//   const sortedProducts = productsWithCategoriesandImage.sort((a, b) => a.productName.localeCompare(b.productName));
//   sortedProducts.sort((a, b) => Number(a.size) - Number(b.size));

//     return NextResponse.json([sortedProducts, finalPriority]);


//   } catch (error) {
//     console.log('[NAVBAR_PRODUCTS_GET]', error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// };





import { PriorityMenu } from "@/app/(frontend)/types";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

function shortenMaterial(name: string): string {
  return name
    .replace(/Polypropylene/gi, "Poly")
    // .replace(/Satori /gi, "")
    .replace(/Aluminum/gi, "Alu");
}

export async function GET(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        brandId: params.brandId,
        isArchived: false,
      },
      select:{
          name: true,
          slug: true,
          id: true,
          navbarNotes: true,
          priority: true,
          size: true,
          isNewProduct: true,
          tempAllFinished: true,
          cover_img_url: true
      }
    });


    const priority = await prismadb.menupriority.findMany({})

    const productIds = products.map(product => product.id);

    const categories = await prismadb.allproductcategory.findMany({
      where:{
          productId:{
              in: productIds
          }
      },
      include:{
        category: {
          select: {
            type: true,
            name: true,
          }
        },
      }
    })
    
  const productsWithCategoriesandImage = products.map(product => {
      const productCategories = categories.filter(category => category.productId === product.id);
      
      const categoryDetails = productCategories.map(category => ({
      type: category.category.type,
      name: category.category.name,
      }));

  
      return {
        productName: shortenMaterial(product.name),
        productSlug: product.slug,
        categories: categoryDetails,
        url: product.cover_img_url,
        navbarNotes: product.navbarNotes,
        priority: product.priority,
        newProd: product.isNewProduct,
        size: product.size.name,
        tempAllFinished: product.tempAllFinished
      };
  });

  let finalPriority : PriorityMenu[] = []
  priority.map((val) =>{
    let temp : PriorityMenu = {
      priorityId: val.id,
      categoryId: val.categoryId,
      categoryName: categories.find((cat) => cat.categoryId === val.categoryId)?.category.name ?? '',
      priority: val.priorityNumber,
      menuType: categories.find((cat) => cat.categoryId === val.categoryId)?.category.type ?? '',
      productId: val.productId,
      productName: shortenMaterial(products.find((prod) => prod.id === val.productId)?.name ?? '')
    }
    finalPriority.push(temp)
  })


  const sortedProducts = productsWithCategoriesandImage.sort((a, b) => a.productName.localeCompare(b.productName));
  sortedProducts.sort((a, b) => Number(a.size) - Number(b.size));

    return NextResponse.json([sortedProducts, finalPriority]);


  } catch (error) {
    console.log('[NAVBAR_PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};