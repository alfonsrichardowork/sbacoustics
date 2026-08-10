import { NavbarCategory, NavbarProducts, PriorityMenu } from "@/app/(frontend)/types";
import { redirect } from "next/navigation";

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_NAVBAR_CONTENT}`;

const getAllNavbarContent = async (path: string): Promise<[NavbarProducts[], PriorityMenu[]]> => {
  let allNavbarProducts: Array<NavbarProducts> = []
  const brandId = path.includes('sbaudience') ? process.env.NEXT_PUBLIC_SB_AUDIENCE_ID : path.includes('sbautomotive') ? process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID : process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
  const API_EDITED = API.replace('{brandId}', brandId ?? '680c5eee-7ed7-41bc-b14b-4185f8a1c379'); //SBAcoustics ID as default
  const response = await fetch(API_EDITED, {
    next: { revalidate: 30 }
  });
  if (!response.ok) {
    redirect('/');
    // throw new Error('Failed to fetch navbar products');
  }
  const data = await response.json();
  if (!data) {
    redirect('/');
  }

  for (let i = 0; i < data[0].length; i++) {
    let allNavbarCat: Array<NavbarCategory> = []
    for(let j = 0; j < data[0][i].categories.length; j++){
      let cat: NavbarCategory = {
        name: data[0][i].categories[j].name,
        type: data[0][i].categories[j].type,
      }
      allNavbarCat.push(cat)
    }
    let product: NavbarProducts = {
      name: data[0][i].productName,
      href: "/products/".concat(data[0][i].productSlug),
      categories: allNavbarCat,
      url: data[0][i].url,
      navbarNotes: data[0][i].navbarNotes,
      priority: data[0][i].priority,
      newProduct: data[0][i].newProd,
      tempAllFinished: data[0][i].tempAllFinished
    }
    allNavbarProducts.push(product)
  }

  return [allNavbarProducts, data[1]];
};

export default getAllNavbarContent;

