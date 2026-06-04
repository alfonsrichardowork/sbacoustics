import { redirect } from "next/navigation";

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_SUBSUBCAT_NAME_BY_SLUG}`;

const getSubSubCatNameBySlug = async (path: string, slug: string): Promise<string> => {
  const brandId = path.includes('sbaudience') ? process.env.NEXT_PUBLIC_SB_AUDIENCE_ID : path.includes('sbautomotive') ? process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID : process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
  const API_EDITED_BRANDID = API.replace('{brandId}', brandId ?? '680c5eee-7ed7-41bc-b14b-4185f8a1c379'); //SBAcoustics ID as default
  const API_EDITED = API_EDITED_BRANDID.replace('{subSubCategorySlug}', slug)
  const response = await fetch(API_EDITED, {
    next: { revalidate: 30 }
  });
  if (!response.ok) {
    redirect('/');
    // throw new Error('Failed to fetch SubSubCat Name by Slug');
  }
  const data = await response.json();
  if (!data) {
    redirect('/');
  }
  return data;
};

export default getSubSubCatNameBySlug;

