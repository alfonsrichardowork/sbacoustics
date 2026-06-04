import { redirect } from "next/navigation";

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_COMPARISON_ATTRIBUTE_SINGLE_PRODUCT}`;

const getCompareAttr = async (path: string, productSlug: string): Promise<string[]> => {
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
  const data = await response.json();
  if (!data) {
    redirect('/');
  }
  let finalData: string[] = [data.name, data.cover_img_url]
  return finalData;
};

export default getCompareAttr;

