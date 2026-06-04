import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { checkAuth, checkBearerAPI, getSession } from '@/lib/actions';
import { image_catalogues, multiple3dmodels, multipledatasheetproduct, multiplefrdzmafiles } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const slugify = (str: string): string => {
  const normalizedStr = str.replace(/["“”‟″‶〃״˝ʺ˶ˮײ]/g, "'");
  const strAfterQuote = normalizedStr.includes("'") ? normalizedStr.split("'")[1] : normalizedStr;
  const strBeforeSlash = strAfterQuote?.includes('/') ? strAfterQuote.split('/')[0] : strAfterQuote;
  const strWithoutSatori = strBeforeSlash?.replace(/SATORI/gi, '');
  return strWithoutSatori?.toLowerCase()
                         .replace(/[^a-z0-9]+/g, '-')
                         .replace(/(^-|-$)+/g, '') ?? '';
};

export async function POST(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();

    if(!session.isLoggedIn || !session){
      return NextResponse.json("expired_session")
    }
    
    if(!(await checkBearerAPI(session))){
      session.destroy();
      return NextResponse.json("invalid_token")
    }

    const body = await req.json();

    const { name, sizeId,  description, isFeatured, isArchived, isKits, isNewProduct, images_catalogues, cover_img_url, drawing_img_url, graph_img_url, multipleDatasheetProduct, multipleFRDZMAFiles, multiple3DModels, navbarNotes, searchbox_desc } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    

    const duplicates = await prismadb.product.findFirst({
      where:{
        name,
        brandId: params.brandId
      }
    })

    if(duplicates){
      return NextResponse.json("duplicate")
    }

    const product = await prismadb.product.create({
      data: {
        name: name,
        slug: slugify(name),
        description,
        drawing_img_url,
        cover_img_url,
        graph_img_url,
        isFeatured,
        isArchived,
        isKits,
        isNewProduct,
        sizeId,
        navbarNotes,
        searchbox_desc,
        updatedBy: session.name,
        createdAt: new Date(),
        updatedAt: new Date(),
        brandId: params.brandId,
      },
    });


    if(images_catalogues.length!=0){
      images_catalogues.map(async (value: image_catalogues) => {
        if(value.url!=''){
          await prismadb.image_catalogues.create({
            data:{
              productId: product.id,
              url:value.url,
              name: value.name,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
        }
      })
    }

    if(multipleDatasheetProduct.length!=0){
      multipleDatasheetProduct.map(async (datasheet: multipledatasheetproduct) => {
        if(datasheet.url!=''){
          await prismadb.multipledatasheetproduct.create({
            data:{
              productId: product.id,
              url:datasheet.url,
              name: datasheet.name
            }
          })
        }
      })
    }
    
    if(multipleFRDZMAFiles.length!=0){
      multipleFRDZMAFiles.map(async (FRDZMA: multiplefrdzmafiles) => {
        if(FRDZMA.url!=''){
          await prismadb.multiplefrdzmafiles.create({
            data:{
              productId: product.id,
              url:FRDZMA.url,
              name: FRDZMA.name
            }
          })
        }
      })
    }

    if(multiple3DModels.length!=0){
      multiple3DModels.map(async (models: multiple3dmodels) => {
        if(models.url!=''){
          await prismadb.multiple3dmodels.create({
            data:{
              productId: product.id,
              url:models.url,
              name: models.name
            }
          })
        }
      })
    }

    const allChecks : [boolean, string][] = [
      [isKits, process.env.NEXT_PUBLIC_KITS_CATEGORY_ID ?? ''],
    ]
    allChecks.map( async (val) => {
      if (val[0]) { //is.. is checked
        const check = await prismadb.allproductcategory.findFirst({ //is There already a '..' inside this product category?
          where: {
            productId: product.id,
            categoryId: val[1]
          },
          include:{
            category: true
          }
        })
        if (!check) {  //no, then add a '..' category for this product
          const avail = await prismadb.allcategory.findFirst({ //check if .. is inside allCategory
            where: {
              brandId: params.brandId,
              id: val[1]
            },
          })
          if (avail){
            await prismadb.allproductcategory.create({ //Create '..' Category for this product
              data: {
                productId: product.id,
                categoryId: avail.id,
                createdAt: new Date(),
                updatedAt: new Date(),
              }
            });
          }
        }
      }
      else{ // This is in fact, not a .. product. Then delete '..' inside this product category
        try {
          const Category = await prismadb.allproductcategory.findFirst({ // Find if there is an active '..' Category
            where: {
              productId: product.id,
              categoryId: val[1]
            },
            include:{
              category: true
            }
          });
          if (Category) {
            await prismadb.allproductcategory.deleteMany({ // Delete '..' category
              where: {
                id: Category.id
              }
            });
          }
        } catch (error) {
          // Ignore if not found
        }
      }
    })

    revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}/products/${product.slug}`);
  
    return NextResponse.json("success");
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        brandId: params.brandId,
      },
      include: {
        allCat: true,
        size: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
