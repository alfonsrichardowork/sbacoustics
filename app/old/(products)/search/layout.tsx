import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? "http://localhost:3000";
    const logo_URL = `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`

    return {
        title: "Search Drivers and Kits",
        description: "Search Your Drivers and Kits!",
        applicationName: 'SB Acoustics',
        keywords: ["Search SB Acoustics Drivers", "Search SB Acoustics Kits"],
        openGraph: {
            title: "Search Drivers and Kits",
            description: "Search Your Drivers and Kits!",
            url: `${baseUrl}/search`,
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
        title: "Search Drivers and Kits",
        description: "Search Your Drivers and Kits!",
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
            canonical: `${baseUrl}/search`,
        },
    }
   
}

export default function SearchDriversKitsLayout({
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
