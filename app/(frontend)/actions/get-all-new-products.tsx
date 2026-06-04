import { NewProduct } from "@/app/(frontend)/types";
import { redirect } from "next/navigation";

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_NEW_PRODUCTS}`;

function shortenMaterial(name: string): string {
  return name
    .replace(/Polypropylene/gi, "Poly")
    // .replace(/Satori /gi, "")
    .replace(/Aluminum/gi, "Alu");
}

const getAllNewProducts = async (path: string): Promise<[NewProduct[], NewProduct[]]> => {
  let allNewProducts: Array<NewProduct> = []
  let allNewKits: Array<NewProduct> = []
  
  const brandId = path.includes('sbaudience') ? process.env.NEXT_PUBLIC_SB_AUDIENCE_ID : path.includes('sbautomotive') ? process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID : process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
  const API_EDITED = API.replace('{brandId}', brandId ?? '680c5eee-7ed7-41bc-b14b-4185f8a1c379'); //SBAcoustics ID as default
  const response = await fetch(API_EDITED, {
    next: { revalidate: 30 }
  });

  if (!response.ok) {
    redirect('/');
      // throw new Error('Failed to fetch NEW products');
  }
  const data = await response.json();
  if (!data) {
    redirect('/');
  }

  for (let i = 0; i < data.length; i++) {
    if(!data[i].isKits && data[i].cover_img_url!==''){
      let tempnew : NewProduct = {
        productId: data[i].id,
        image_url: data[i].cover_img_url,
        name: shortenMaterial(data[i].name),
        href: '/products/'.concat(data[i].slug),
        navbarNotes: data[i].navbarNotes
      }
      allNewProducts.push(tempnew)
    }
    else if(data[i].isKits && data[i].cover_img_url!==''){
      let tempnew : NewProduct = {
        productId: data[i].id,
        image_url: data[i].cover_img_url,
        name: shortenMaterial(data[i].name),
        href: '/products/'.concat(data[i].slug),
        navbarNotes: data[i].navbarNotes
      }
      allNewKits.push(tempnew)
    }
  }

  return [allNewKits, allNewProducts];
};

export default getAllNewProducts;

