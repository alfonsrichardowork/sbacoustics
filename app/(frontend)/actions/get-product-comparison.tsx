import { AllCategory, FilesProp, FilesWithOrder, SimpleProdTypes, SingleProducts, SingleProductsType, Size, SpecificationProp } from "@/app/(frontend)/types";
import { allfinishing } from "@prisma/client";
import { redirect } from "next/navigation";

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ONE_PRODUCT}`;

type SingleProductsTypeComplete = {
  product: SingleProductsType;
  similarProd: {
    id: string;
    name: string;
    slug: string;
    cover_img: any; // you can replace `any` with Prisma's actual image type
  }[];
  usedInKits: {
    id: string;
    name: string;
    slug: string;
    cover_img: any;
  }[];
  allKitsFinishing: allfinishing[]
  specifications: SpecificationProp[]
};

const getProductComparison = async (path: string, productSlug: string): Promise<SingleProducts> => {
  const brandId = path.includes('sbaudience') ? process.env.NEXT_PUBLIC_SB_AUDIENCE_ID : path.includes('sbautomotive') ? process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID : process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
  const API_EDITED_BRANDID = API.replace('{brandId}', brandId ?? '680c5eee-7ed7-41bc-b14b-4185f8a1c379'); //SBAcoustics ID as default
  const API_EDITED = API_EDITED_BRANDID.replace('{productSlug}', productSlug)
  const response = await fetch(API_EDITED, {
    next: { revalidate: 30 }
  });
  if (!response.ok) {
    redirect('/');
    // throw new Error('Failed to fetch one product');
  }
  const data: SingleProductsTypeComplete = await response.json();
  if (!data) {
    redirect('/');
  }

  let prod_cat: Array<AllCategory> = []
  let prod_sub_cat: Array<AllCategory> = []
  let prod_sub_sub_cat: Array<AllCategory> = []

  let all_image_catalogues : Array<FilesProp> = []
  let all_kits_finishing : Array<FilesProp> = []
  let all_kits_finishing_preview : Array<FilesWithOrder> = []
  let all_datasheet : Array<FilesProp> = []
  let all_frdzma : Array<FilesProp> = []
  let all_models3d : Array<FilesProp> = []
  let all_similar_prods : Array<SimpleProdTypes> = []
  let all_products_in_kits : Array<SimpleProdTypes> = []
  if (data){
    if(data.product.allCat){
      for (let i = 0; i < data.product.allCat.length; i++) {
        let temp: AllCategory = {
          id: data.product.allCat[i]?.id ?? '',
          name: data.product.allCat[i]?.category.name ?? '',
          slug: data.product.allCat[i]?.category.slug ?? ''
        }
        if(data.product.allCat[i]?.category.type === "Category"){
          prod_cat.push(temp)
        }
        else if(data.product.allCat[i]?.category.type === "Sub Category"){
          prod_sub_cat.push(temp)
        }
        else{
          prod_sub_sub_cat.push(temp)
        }
      }
    }

    data.product.images_catalogues && data.product.images_catalogues.length > 0 && data.product.images_catalogues.map((img: any) => {
      all_image_catalogues.push({
        name: img.name,
        url: img.url,
        productId: img.id
      })
    })
    
    data.allKitsFinishing && data.allKitsFinishing.length > 0 && data.allKitsFinishing.map((img) => {
      all_kits_finishing.push({
        name: img.name,
        url: img.url,
        productId: img.id
      })
    })

    data.product.kitsFinishing && data.product.kitsFinishing.length > 0 && data.product.kitsFinishing.map((img) => {
      all_kits_finishing_preview.push({
        name: img.finishing.name,
        url: img.url,
        productId: img.productId,
        order: img.order
      })
    })
    
    data.product.multipleDatasheetProduct && data.product.multipleDatasheetProduct.length > 0 && data.product.multipleDatasheetProduct.map((img : any) => {
      all_datasheet.push({
        name: img.name,
        url: img.url,
        productId: img.id
      })
    })
    
    data.product.multipleFRDZMAFiles && data.product.multipleFRDZMAFiles.length > 0 && data.product.multipleFRDZMAFiles.map((img: any) => {
      all_frdzma.push({
        name: img.name,
        url: img.url,
        productId: img.id
      })
    })
    
    data.product.multiple3DModels && data.product.multiple3DModels.length > 0 && data.product.multiple3DModels.map((img: any) => {
      all_models3d.push({
        name: img.name,
        url: img.url,
        productId: img.id
      })
    })
    
    data.similarProd && data.similarProd.length > 0 && data.similarProd.map((prod) => {
      all_similar_prods.push({
        ProductId: prod.id,
        image_url: prod.cover_img,
        name: prod.name,
        href: prod.slug,
      })
    })
    
    data.usedInKits && data.usedInKits.length > 0 && data.usedInKits.map((prod) => {
      all_products_in_kits.push({
        ProductId: prod.id,
        image_url: prod.cover_img,
        name: prod.name,
        href: prod.slug,
      })
    })

    let size = {} as Size;
    if(data.product.size!=null){
      let size2: Size = {
        label: data.product.size.value,
        value: Number(data.product.size.name)
      }
      size = size2  
    }
    
    let product: SingleProducts = {
      coverImg: data.product.cover_img_url,
      size: size,
      images_Catalogues: all_image_catalogues,
      drawing: data.product.drawing_img_url,
      graph: data.product.graph_img_url,
      categories: prod_cat,
      sub_categories: prod_sub_cat,
      sub_sub_categories: prod_sub_sub_cat,
      kitsFinishing: all_kits_finishing,
      kitsFinishingPreview: all_kits_finishing_preview,
      datasheet: all_datasheet,
      frdzma: all_frdzma,
      models3d: all_models3d,
      similarProds: all_similar_prods,
      productsinKits: all_products_in_kits,
      specification: data.specifications,
      id: data.product.id,
      name: data.product.name,
      desc: data.product.description,
      slug: data.product.slug,
      isKits: data.product.isKits
    }
    
    
    return product;
  }
  let product: SingleProducts = {
    coverImg: '',
    size: {
      value:0,
      label:'',
    },
    images_Catalogues: all_image_catalogues,
    drawing: '',
    graph: '',
    categories: prod_cat,
    sub_categories: prod_sub_cat,
    sub_sub_categories: prod_sub_sub_cat,
    kitsFinishing: all_kits_finishing,
    kitsFinishingPreview: all_kits_finishing_preview,
    datasheet: all_datasheet,
    frdzma: all_frdzma,
    models3d: all_models3d,
    similarProds: all_similar_prods,
    productsinKits: all_products_in_kits,
    specification: [],
    id: "",
    name: "",
    desc: "",
    slug: "",
    isKits: false,
  }
  return product;
};

export default getProductComparison;

