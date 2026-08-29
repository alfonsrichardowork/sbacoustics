import prismadb from "@/lib/prismadb";
import GoogleCaptchaWrapper from "@/components/GoogleCaptchaWrapper";
import Contact from "../../components/contact";

export const revalidate = 60;

export function extractIframeSrc(html: string): string | undefined {
  const match = html.match(/<iframe[^>]+src="([^"]+)"/i);
  return match?.[1];
}

export default async function ContactUsJsonLd() {
  const brand = await prismadb.brand.findFirst({
    where: {
      id: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID
    }
  });
  if(!brand){
    return null;
  }
  const extractedSrc = extractIframeSrc(brand.maps) ?? '';
  brand.maps = extractedSrc;
  return (
    <>
      {/* <div className="relative pb-[420px]">
        <div className="absolute inset-0 z-0">
          {brand && brand.cover != "" ?
            <img 
                src={brand.cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brand.cover}` : brand.cover } 
                alt="Sinar Baja Electric Facility" 
                width={1000} 
                height={1000} 
                className="w-screen h-[600px] object-cover object-center"
            />
            :
            <Empty className='w-screen min-h-[600px] z-10 bg-foreground/20'>
              <EmptyMedia variant="icon">
                <Image />
              </EmptyMedia>
              <EmptyContent>
                <EmptyTitle>No Cover Image Available</EmptyTitle>
                <EmptyDescription></EmptyDescription>
              </EmptyContent>
            </Empty>
          }
        </div>
        <div className="relative z-10 top-96"> */}
          <GoogleCaptchaWrapper>
            <Contact oneBrand={brand}/>
          </GoogleCaptchaWrapper>
        {/* </div>
      </div> */}
    </>
  );
}
