import prismadb from '@/lib/prismadb';
import BrandChoiceOldClient from './BrandChoiceOldClient';

export default async function BrandChoiceOld() {
  const brandImagesSBAudience = await prismadb.brand.findFirst({
    where: {
      id: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID
    },
    select: {
      homepage_brand_choice_url: true,
      homepage_brand_choice_text: true
    }
  })
  const brandImagesSBAutomotive = await prismadb.brand.findFirst({
    where: {
      id: process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID
    },
    select: {
      homepage_brand_choice_url: true,
      homepage_brand_choice_text: true
    }
  })
  if(!brandImagesSBAudience || brandImagesSBAudience.homepage_brand_choice_url === ''){
    return null
  }
  if(!brandImagesSBAutomotive || brandImagesSBAutomotive.homepage_brand_choice_url === ''){
    return null
  }
  return (
    <BrandChoiceOldClient text={brandImagesSBAudience.homepage_brand_choice_text} url={brandImagesSBAudience.homepage_brand_choice_url} />
  );
}
