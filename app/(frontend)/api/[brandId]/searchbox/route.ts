import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { specForSearchbox } from '@/app/(frontend)/utils/filterPageProps';

export async function GET(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }

    const allSpecsNeeded = await prismadb.dynamicspecification.findMany({
      where: {
        slug: {
          in : specForSearchbox.map((val) => val)
        }
      },
      select: {
        id: true
      }
    })

    const products = await prismadb.product.findMany({
      where: {
        brandId: params.brandId,
        isArchived: false,
      },
      select: {
        isKits: true,
        searchbox_desc: true,
        name: true,
        slug: true,
        id: true,
        cover_img_url: true,
        productsKits: {
          select: {
            productUsedInKits: {
              select: {
                name: true,
                slug: true,
              }
            }
          }
        },
        size: true,
        allCat: {
          select:{
            category: {
              select: {
                type: true,
                name: true,
              }
            },
            productId: true
          }
        },
        connectorSpecifications: {
          where: {
            dynamicspecificationId: {
              in: allSpecsNeeded.map((val) => val.id)
            }
          },
          include: {
            dynamicspecification: {
              select: {
                name: true,
                unit: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });


      const productsWithCategoriesandImage = products.map((product) => {      
        let tempName = ""
        product.allCat.map(category => {
            tempName = tempName.concat(category.category.name, " ");
            return { tempName };
        });
        let cat: string[] = []
        let subcat: string[] = []
        let subsubcat: string[] = []
        let size: string[] = []
        let productInKits: string[] = []
        
        product.allCat.map(category => {
          category.category.type === 'Category' && cat.push(category.category.name)
          category.category.type === 'Sub Category' && subcat.push(category.category.name)
          category.category.type === 'Sub Sub Category' && subsubcat.push(category.category.name)
        });

        let add_info = ''
        // if(additional_info[index]){
          if(product.isKits){
            add_info = product.searchbox_desc || 
            "";
            size.push('Kits')
          }
          else{
            const parts: string[] = [];

            if(product.size){
              if (product.size.name !== "None") {
                parts.push(`${product.size.name}"`);
              }
              size.push(product.size.name)
              size.push(product.size.name.concat(" inch"))
              size.push(product.size.value)
            }
            product.connectorSpecifications.map((val) => {
              val.value !== '' && parts.push(`${val.value} ${val.dynamicspecification.unit}`)
            })
            if(product.searchbox_desc !== ''){
              add_info = add_info.concat(product.searchbox_desc)
              if(parts.length > 0){
                add_info = add_info.concat(" - ", parts.join(" - "))
              }
            }
            else{
              add_info = parts.join(" - ")
            }
          }



          // const tempProductsInKits: string[] = [];
          // product.productsUsedInKits && product.productsUsedInKits.length > 0 && product.productsUsedInKits.map((item, index) => {
          //   tempProductsInKits.push(products.find((val)=> val.id === item.productUsedInKitsId)?.name ?? '')
          // })
          // tempProductsInKits.length > 0 && (tempName = tempName.concat(tempProductsInKits.join(" "), " "))
          product.productsKits && product.productsKits.length > 0 && product.productsKits.map((item, index) => {
            productInKits.push(item.productUsedInKits.name)
          })
          
          if(tempName.toLowerCase().includes('nrx') || tempName.toLowerCase().includes('norex') || product.name.toLowerCase().includes('nrx') || product.name.toLowerCase().includes('norex')){
            subcat.push('Paper')
            subsubcat.push('Paper')
          }
        // }
        return {
          label: product.name,
          size,
          cat,
          subcat, 
          subsubcat,
          productInKits,
          slug: product.slug,
          url: product.cover_img_url,
          info: add_info        
        };
      });
      return NextResponse.json(productsWithCategoriesandImage);
  } catch (error) {
    console.log('[SEARCHBOX_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};