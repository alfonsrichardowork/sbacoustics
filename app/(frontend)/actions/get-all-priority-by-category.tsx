import { allproductcategory } from "@prisma/client";
import { redirect } from "next/navigation";

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_PRIORITY_BY_CATEGORY}`;

const getAllPriorityBySubCategory = async (path: string, subsubcategory: string): Promise<allproductcategory[]> => {
 
    const brandId = path.includes('sbaudience') ? process.env.NEXT_PUBLIC_SB_AUDIENCE_ID : path.includes('sbautomotive') ? process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID : process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
    const API_EDITED_BRANDID = API.replace('{brandId}', brandId ?? '680c5eee-7ed7-41bc-b14b-4185f8a1c379'); //SBAcoustics ID as default
    const API_EDITED = API_EDITED_BRANDID.replace('{category}', subsubcategory)
    const response = await fetch(API_EDITED, {
    next: { revalidate: 30 }
  });
    if (!response.ok) {
        redirect('/');
        // throw new Error(`Failed to fetch products by ${subsubcategory}`);
    }
    const data : allproductcategory[] = await response.json();
    if (!data) {
        redirect('/');
    }

    return data
};

export default getAllPriorityBySubCategory;

