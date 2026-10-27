import LogoutButtonNoBrands from '@/app/(admin)/admin/components/logout-no-brands';
import Navbar from '@/app/(admin)/admin/components/navbar'
import { connection } from 'next/server';

export const instant = false

export default async function DashboardLayout(
  props: {
    children: React.ReactNode
    params: Promise<{ brandId: string }>
  }
) {
  await connection();
  const params = await props.params;

  const {
    children
  } = props;

  return (
    <div>
    {params.brandId === 'undefined' ? (
        <div className="flex flex-col items-center justify-center h-screen w-full text-center">
        <p>You have not been assigned to any brands. Please contact administrator.</p>
        <div className='pt-5'>
        <LogoutButtonNoBrands />
        </div>
      </div>
    ):(
      <>
        <Navbar />
        <div className='lg:px-40 md:px-24 sm:px-12 px-4'>
          {children}
        </div>
      </>
    )}
    </div>
  );
}
