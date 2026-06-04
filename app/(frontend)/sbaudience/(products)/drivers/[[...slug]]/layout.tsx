import prismadb from "@/lib/prismadb";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
    const { slug = [] } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? "http://localhost:3000";
    const logo_URL = `${baseUrl}/images/sbaudience/logo_sbaudience.webp`


    const subslug = slug[0] || null;

    if (!subslug) {
        return {
            title: "All Drivers",
            description: "All Drivers Provided by SB Audience",
            applicationName: 'SB Audience',
            keywords: ["All SB Audience Drivers", "All Drivers by SB Audience", "All Compression Drivers by SB Audience", "All Woofers by SB Audience", "All Subwoofers by SB Audience", "All Open Baffle Drivers by SB Audience", "All Coaxials by SB Audience", "All Horns by SB Audience"],
            openGraph: {
            title: "All Drivers",
            description: "All Drivers Provided by SB Audience",
            url: `${baseUrl}/sbaudience/drivers`,
            siteName: "SB Audience",
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
                alt: `SB Audience Logo`,
                },
            ],
            locale: 'id_ID',
            type: "website",
            },
            twitter: {
            card: "summary_large_image",
            title: "All Drivers",
            description: "All Drivers Provided by SB Audience",
            images: [
                {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: `SB Audience Logo`,
                },
            ],
            },
            alternates: {
            canonical: `${baseUrl}/sbaudience/drivers`,
            },
        }
    }
    else if (subslug === "all") {
        return {
            title: `All Drivers`,
            description: `Found out more about All Drivers from SB Audience!`,
            applicationName: 'SB Audience',
            keywords: [`All Drivers by SB Audience`, `All Drivers`, `SB Audience All Drivers`, `All Products by SB Audience`],
            openGraph: {
            title: `All Drivers`,
            description: `Found out more about All Drivers from SB Audience!`,
            url: `${baseUrl}/sbaudience/drivers/all`,
            siteName: "SB Audience",
            images: [
                {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: `SB Audience Logo`,
                },
            ],
            locale: 'id_ID',
            type: "website",
            },
            twitter: {
            card: "summary_large_image",
            title: `All Drivers`,
            description: `Found out more about All Drivers from SB Audience!`,
            images: [
                {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: `SB Audience Logo`,
                },
            ],
            },
            alternates: {
            canonical: `${baseUrl}/sbaudience/drivers/all`,
            },
        };
    }
    else if (subslug) {
        const [subCatNameResult] = await Promise.allSettled([
            await prismadb.allcategory.findFirst({
                where: {
                    slug: subslug ?? '',
                    type: 'Sub Category',
                    brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID
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
            description: `Found out more about ${subCatName?.name} from SB Audience!`,
            applicationName: 'SB Audience',
            keywords: [`${subCatName?.name}`, `${subCatName?.name} SB Audience`, `${subCatName?.name} Products by SB Audience`],
            openGraph: {
            title: `${subCatName?.name}`,
            description: `Found out more about ${subCatName?.name} from SB Audience!`,
            url: `${baseUrl}/sbaudience/drivers/${subslug}`,
            siteName: "SB Audience",
            images: [
                // {
                //   url: logo_URL,
                //   width: 1200,
                //   height: 630,
                //   alt: subCatName?.name.name.concat(" ", seriesName.name," Series"),
                // },
                {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: `SB Audience Logo`,
                },
            ],
            locale: 'id_ID',
            type: "website",
            },
            twitter: {
            card: "summary_large_image",
            title: `${subCatName?.name}`,
            description: `Found out more about ${subCatName?.name} from SB Audience!`,
            images: [
                {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: `SB Audience Logo`,
                },
            ],
            },
            alternates: {
            canonical: `${baseUrl}/sbaudience/drivers/${subslug}`,
            },
        };
    }
    else {
        return {
            title: "All Drivers",
            description: "All Drivers Provided by SB Audience",
            applicationName: 'SB Audience',
            keywords: ["All SB Audience Drivers", "All Drivers by SB Audience", "All Compression Drivers by SB Audience", "All Woofers by SB Audience", "All Subwoofers by SB Audience", "All Open Baffle Drivers by SB Audience", "All Coaxials by SB Audience", "All Horns by SB Audience"],
            openGraph: {
            title: "All Drivers",
            description: "All Drivers Provided by SB Audience",
            url: `${baseUrl}/sbaudience/drivers`,
            siteName: "SB Audience",
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
                alt: `SB Audience Logo`,
                },
            ],
            locale: 'id_ID',
            type: "website",
            },
            twitter: {
            card: "summary_large_image",
            title: "All Drivers",
            description: "All Drivers Provided by SB Audience",
            images: [
                {
                url: logo_URL,
                width: 800,
                height: 800,
                alt: `SB Audience Logo`,
                },
            ],
            },
            alternates: {
            canonical: `${baseUrl}/sbaudience/drivers`,
            },
        }
    }
}

export default function SBAudienceDriversLayout({
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
