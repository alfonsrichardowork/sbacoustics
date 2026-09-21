import { redirect } from 'next/navigation';

import prismadb from '@/lib/prismadb';
import { getSession } from '@/lib/actions';


// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;


export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getSession();

  if(!session.isLoggedIn){
    redirect(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/sign-in`)
  }

  if(session.isAdmin){
    const brand = await prismadb.brand.findFirst({
      where: {
        userId: session.userId,
      }
    });
    if (brand) {
      redirect(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${brand.id}`);
    };
  }
  else{
    const brand = await prismadb.roles.findFirst({
      where: {
        userId: session.userId,
      }
    });
    if (brand) {
      redirect(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${brand.brandId}`);
    }
    else{
      redirect(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/undefined`);
    }
  }
  
  

  return (
    <>
      {children}
    </>
  );
}
