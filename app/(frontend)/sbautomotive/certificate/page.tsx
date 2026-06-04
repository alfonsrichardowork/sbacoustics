export const dynamic = "force-dynamic";
import PageLoader from "@/components/pageLoader";

export default async function CertificatePage() {
//   const alldistributorsserver = await getAllDistributor('');


  return (
  <>
    <PageLoader/>
    <div className='md:grid md:grid-cols-3 md:px-0 md:py-0 px-8 py-4 '>
    <div></div>
    <div className='py-16'>
         <div className="justify-center flex text-3xl font-bold">
            Certificate of Authenticity
        </div>
    </div>
    <div></div>
    </div>
    </>
  )
}
