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
            title: "All Kits",
            description: "All Kits Products Provided by SB Acoustics",
            applicationName: 'SB Acoustics',
            keywords: ["All SB Acoustics Kits", "All Kits by SB Acoustics", "All SB Acoustics Kits by SB Acoustics", "All Open Source Kits by SB Acoustics", "All Accessories by SB Acoustics"],
            openGraph: {
            title: "All Kits",
            description: "All Kits Products Provided by SB Acoustics",
            url: `${baseUrl}/kits`,
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
            title: "All Kits",
            description: "All Kits Products Provided by SB Acoustics",
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
            canonical: `${baseUrl}/kits`,
            },
        }
    }
    else if (subslug === "all") {
        return {
            title: `All Kits`,
            description: `Found out more about All Kits from SB Acoustics!`,
            applicationName: 'SB Acoustics',
            keywords: [`All Kits by SB Acoustics`, `All Kits`, `SB Acoustics All Kits`, `All Products by SB Acoustics`],
            openGraph: {
            title: `All Kits`,
            description: `Found out more about All Kits from SB Acoustics!`,
            url: `${baseUrl}/kits/all`,
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
            title: `All Kits`,
            description: `Found out more about All Kits from SB Acoustics!`,
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
            canonical: `${baseUrl}/kits/all`,
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
            title: `${subCatName?.name}`,
            description: `Found out more about ${subCatName?.name} from SB Acoustics!`,
            url: `${baseUrl}/kits/${subslug}`,
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
            canonical: `${baseUrl}/kits/${subslug}`,
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
            description: `Found out more about ${subSubCatName?.name} Kits from SB Acoustics!`,
            applicationName: 'SB Acoustics',
            keywords: [`${subSubCatName?.name}`, `${subSubCatName?.name} SB Acoustics`, `${subSubCatName?.name} Kits by SB Acoustics`],
            openGraph: {
            title: `${subSubCatName?.name}`,
            description: `Found out more about ${subSubCatName?.name} Kits from SB Acoustics!`,
            url: `${baseUrl}/kits/${subslug}/${subsubslug}`,
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
            description: `Found out more about ${subSubCatName?.name} Kits from SB Acoustics!`,
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
            canonical: `${baseUrl}/kits/${subslug}/${subsubslug}`,
            },
        }
    }
    else {
        return {
            title: "All Kits",
            description: "All Kits Products Provided by SB Acoustics",
            applicationName: 'SB Acoustics',
            keywords: ["All SB Acoustics Kits", "All Kits by SB Acoustics", "All SB Acoustics Kits by SB Acoustics", "All Open Source Kits by SB Acoustics", "All Accessories by SB Acoustics"],
            openGraph: {
            title: "All Kits",
            description: "All Kits Products Provided by SB Acoustics",
            url: `${baseUrl}/kits`,
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
            title: "All Kits",
            description: "All Kits Products Provided by SB Acoustics",
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
            canonical: `${baseUrl}/kits`,
            },
        }
    }
}

export default function KitsLayout({
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
