import prismadb from "@/lib/prismadb";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
    const { slug = [] } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? "http://localhost:3000";
    const logo_URL = `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`

    const subslug = slug[0] || null;
    const subsubslug = slug[1] || null;

    if (!subslug && !subsubslug) {
        return {
            title: "All Drivers",
            description: "All Drivers Provided by SB Acoustics",
            applicationName: 'SB Acoustics',
            keywords: ["All SB Acoustics Drivers", "All Drivers by SB Acoustics", "All Tweeters by SB Acoustics", "All Widebanders by SB Acoustics", "All Midranges by SB Acoustics", "All Midwoofers by SB Acoustics", "All Woofers by SB Acoustics", "All Full Ranges by SB Acoustics", "All Subwoofers by SB Acoustics", "All Shallow Subwoofers by SB Acoustics", "All Passive Radiators by SB Acoustics", "All Coaxials by SB Acoustics", "All OEM by SB Acoustics"],
            openGraph: {
                title: "All Drivers",
                description: "All Drivers Provided by SB Acoustics",
                url: `${baseUrl}/drivers`,
                siteName: "SB Acoustics",
                images: [
                    // {
                    //   url: logo_URL,
                    //   width: 1200,
                    //   height: 630,
                    //   alt: subCatName.name.concat(" ", seriesName.name," Series"),
                    // },
                    {
                    url: logo_URL,
                    width: 800,
                    height: 800,
                    alt: `SB Acoustics Logo`,
                    },
                ],
                locale: 'id_ID',
                type: "website",
            },
            twitter: {
            card: "summary_large_image",
            title: "All Drivers",
            description: "All Drivers Provided by SB Acoustics",
            images: [
                {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: `SB Acoustics Logo`,
                },
            ],
            },
            alternates: {
                canonical: `${baseUrl}/drivers`,
            },
        }
    }
    else if (subslug === "all") {
        return {
            title: `All Drivers`,
            description: `Found out more about All Drivers from SB Acoustics!`,
            applicationName: 'SB Acoustics',
            keywords: [`All Drivers by SB Acoustics`, `All Drivers`, `SB Acoustics All Drivers`, `All Products by SB Acoustics`],
            openGraph: {
            title: `All Drivers`,
            description: `Found out more about All Drivers from SB Acoustics!`,
            url: `${baseUrl}/drivers/all`,
            siteName: "SB Acoustics",
            images: [
                {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: `SB Acoustics Logo`,
                },
            ],
            locale: 'id_ID',
            type: "website",
            },
            twitter: {
            card: "summary_large_image",
            title: `All Drivers`,
            description: `Found out more about All Drivers from SB Acoustics!`,
            images: [
                {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: `SB Acoustics Logo`,
                },
            ],
            },
            alternates: {
            canonical: `${baseUrl}/drivers/all`,
            },
        };
    }
    else if (subslug && !subsubslug) {
        const [subCatNameResult] = await Promise.allSettled([
            await prismadb.allcategory.findFirst({
                where: {
                    slug: subslug ?? '',
                    type: 'Sub Category',
                    brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
                },
                select:{
                    name: true,
                    description: true
                }
            }),
        ]);
        const subCatName = subCatNameResult.status === 'fulfilled' ? subCatNameResult.value : { name: '' };
        return {
            title: `${subCatName?.name}`,
            description: `Found out more about ${subCatName?.name} from SB Acoustics!`,
            applicationName: 'SB Acoustics',
            keywords: [`${subCatName?.name}`, `${subCatName?.name} SB Acoustics`, `${subCatName?.name} Products by SB Acoustics`],
            openGraph: {
            url: `${baseUrl}/drivers/${subslug}`,
            siteName: "SB Acoustics",
            images: [
                // {
                //   url: logo_URL,
                //   width: 1200,
                //   height: 630,
                //   alt: subCatName.name.concat(" ", seriesName.name," Series"),
                // },
                {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: `SB Acoustics Logo`,
                },
            ],
            locale: 'id_ID',
            type: "website",
            },
            twitter: {
            card: "summary_large_image",
            title: `${subCatName?.name}`,
            description: `Found out more about ${subCatName?.name} from SB Acoustics!`,
            images: [
                {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: `SB Acoustics Logo`,
                },
            ],
            },
            alternates: {
            canonical: `${baseUrl}/drivers/${subslug}`,
            },
        };
    }
    else if (subslug && subsubslug) {
        const [subCatNameResult, subSubCatNameResult] = await Promise.allSettled([
            await prismadb.allcategory.findFirst({
                where: {
                    slug: subslug ?? '',
                    type: 'Sub Category',
                    brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
                },
                select:{
                    name: true,
                    description: true
                }
            }),
            await prismadb.allcategory.findFirst({
                where: {
                    slug: subsubslug ?? '',
                    type: 'Sub Sub Category',
                    brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
                },
                select:{
                    name: true,
                    description: true
                }
            }),
        ]);
        const subSubCatName = subSubCatNameResult.status === 'fulfilled' ? subSubCatNameResult.value : { name: '' };
        return {
            title: `${subSubCatName?.name}`,
            description: `Found out more about ${subSubCatName?.name} Drivers from SB Acoustics!`,
            applicationName: 'SB Acoustics',
            keywords: [`${subSubCatName?.name}`, `${subSubCatName?.name} SB Acoustics`, `${subSubCatName?.name} Drivers by SB Acoustics`],
            openGraph: {
            title: `${subSubCatName?.name}`,
            description: `Found out more about ${subSubCatName?.name} Drivers from SB Acoustics!`,
            url: `${baseUrl}/drivers/${subslug}/${subsubslug}`,
            siteName: "SB Acoustics",
            images: [
                // {
                //   url: logo_URL,
                //   width: 1200,
                //   height: 630,
                //   alt: subCatName.name.concat(" ", seriesName.name," Series"),
                // },
                {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: `SB Acoustics Logo`,
                },
            ],
            locale: 'id_ID',
            type: "website",
            },
            twitter: {
            card: "summary_large_image",
            title: `${subSubCatName?.name}`,
            description: `Found out more about ${subSubCatName?.name} Drivers from SB Acoustics!`,
            images: [
                {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: `SB Acoustics Logo`,
                },
            ],
            },
            alternates: {
            canonical: `${baseUrl}/drivers/${subslug}/${subsubslug}`,
            },
        }
    }
    else {
        return {
            title: "All Drivers",
            description: "All Drivers Provided by SB Acoustics",
            applicationName: 'SB Acoustics',
            keywords: ["All SB Acoustics Drivers", "All Drivers by SB Acoustics", "All Tweeters by SB Acoustics", "All Widebanders by SB Acoustics", "All Midranges by SB Acoustics", "All Midwoofers by SB Acoustics", "All Woofers by SB Acoustics", "All Full Ranges by SB Acoustics", "All Subwoofers by SB Acoustics", "All Shallow Subwoofers by SB Acoustics", "All Passive Radiators by SB Acoustics", "All Coaxials by SB Acoustics", "All OEM by SB Acoustics"],
            openGraph: {
            title: "All Drivers",
            description: "All Drivers Provided by SB Acoustics",
            url: `${baseUrl}/drivers`,
            siteName: "SB Acoustics",
            images: [
                // {
                //   url: logo_URL,
                //   width: 1200,
                //   height: 630,
                //   alt: subCatName.name.concat(" ", seriesName.name," Series"),
                // },
                {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: `SB Acoustics Logo`,
                },
            ],
            locale: 'id_ID',
            type: "website",
            },
            twitter: {
            card: "summary_large_image",
            title: "All Drivers",
            description: "All Drivers Provided by SB Acoustics",
            images: [
                {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: `SB Acoustics Logo`,
                },
            ],
            },
            alternates: {
            canonical: `${baseUrl}/drivers`,
            },
        }
    }
}

export default function DriversLayout({
  children,
}: {
  children: React.ReactNode;
    }) {
    return (
        <>
            {children}
        </>
    );
}
