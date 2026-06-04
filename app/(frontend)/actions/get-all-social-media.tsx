import { socialmedia, technicals } from "@prisma/client";
import { redirect } from "next/navigation";

const API=`${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_SOCIAL_MEDIA}`;

const getAllSocialMedia = async (path: string): Promise<socialmedia[]> => {
  const brandId = path.includes('sbaudience') ? process.env.NEXT_PUBLIC_SB_AUDIENCE_ID : path.includes('sbautomotive') ? process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID : process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
  const API_EDITED_BRANDID = API.replace('{brandId}', brandId ?? '680c5eee-7ed7-41bc-b14b-4185f8a1c379');
  const response = await fetch(API_EDITED_BRANDID, {
    next: { revalidate: 30 }
  });
  if (!response.ok) {
    redirect('/');
    // throw new Error('Failed to fetch featured products');
  }
  const data : socialmedia[] = await response.json();
  if (!data) {
    redirect('/not-found');
  }

  return data;
};

export default getAllSocialMedia;

