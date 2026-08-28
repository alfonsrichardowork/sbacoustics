import Link from 'next/link';
import { Button } from '@/components/ui/button';
import prismadb from '@/lib/prismadb';
import BrandChoiceOldSBAudienceClient from './brandChoiceOldsbaudienceclient';

export default async function BrandChoiceOldSBAudience() {
  const brandImagesSBAcoustics = await prismadb.brand.findFirst({
    where: {
      id: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
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
  if(!brandImagesSBAcoustics || brandImagesSBAcoustics.homepage_brand_choice_url === ''){
    return null
  }
  if(!brandImagesSBAutomotive || brandImagesSBAutomotive.homepage_brand_choice_url === ''){
    return null
  }
  return (
    <BrandChoiceOldSBAudienceClient text={brandImagesSBAcoustics.homepage_brand_choice_text} url={brandImagesSBAcoustics.homepage_brand_choice_url} />
  );
}
