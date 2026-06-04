import { MetadataRoute } from "next";
import "dotenv/config"; // Load .env.local variables
import { writeFile } from "fs/promises";
import path from "path";

// Fetch your dynamic URLs (from a database, API, or local data)
async function getProductsDynamicUrls() {
  const brandId = process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
  const API = `${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_PRODUCTS}`
  const API_EDITED_BRANDID = API.replace('{brandId}', brandId ?? '680c5eee-7ed7-41bc-b14b-4185f8a1c379'); //SBAcoustics ID as default
  const res = await fetch(API_EDITED_BRANDID);
  const products = await res.json();
  return products.map((product: { slug: string }) => ({
    url: `${process.env.NEXT_PUBLIC_ROOT_URL}/products/${product.slug}`,
    lastModified: new Date().toISOString(),
  }));
}

// Generate the sitemap dynamically
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productsDynamicUrls = await getProductsDynamicUrls();

  // Static URLs
  const staticUrls = [
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/aboutus`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/catalogues`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/newsletter`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/contact`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/distributors`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/technical`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/new-products`,
      lastModified: new Date().toISOString(),
    },
    
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers`,
      lastModified: new Date().toISOString(),
    },

    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/tweeters`,
      lastModified: new Date().toISOString(),
    },
    // {
    //   url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/filler-drivers`,
    //   lastModified: new Date().toISOString(),
    // },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/widebanders`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/midranges`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/midwoofers`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/woofers`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/full-ranges`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/subwoofers`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/shallow-subwoofers`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/passive-radiators`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/coaxials`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/oem`,
      lastModified: new Date().toISOString(),
    },

    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/tweeters/satori-tweeters`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/tweeters/dome-tweeter`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/tweeters/ring-radiators`,
      lastModified: new Date().toISOString(),
    },
    
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/midranges/satori-midranges`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/midranges/nrx-midranges`,
      lastModified: new Date().toISOString(),
    },

    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/midwoofers/satori-midwoofers`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/midwoofers/cac-midwoofers`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/midwoofers/nbac-midwoofers`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/midwoofers/crc-midwoofers`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/midwoofers/mfc-midwoofers`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/midwoofers/nrx-midwoofers`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/midwoofers/pfcr-midwoofers`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/midwoofers/sfcr-midwoofers`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/midwoofers/pac-midwoofers`,
      lastModified: new Date().toISOString(),
    },

    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/woofers/satori-woofers`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/woofers/cac-woofers`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/woofers/nbac-woofers`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/woofers/nrx-woofers`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/woofers/pfcr-woofers`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/woofers/sfcl-woofers`,
      lastModified: new Date().toISOString(),
    },

    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/oem/tweeters-oem`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/oem/midranges-oem`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/oem/midwoofers-oem`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/oem/woofers-oem`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/oem/subwoofers-oem`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/oem/shallow-subwoofers-oem`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/oem/passive-radiators-oem`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/oem/coaxials-oem`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/oem/satori-midwoofers-oem`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/oem/nbac-midwoofers-oem`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/oem/nrx-midwoofers-oem`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/oem/pfcr-midwoofers-oem`,
      lastModified: new Date().toISOString(),
    },

    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/kits/sb-acoustics-kits`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/kits/open-source-kits`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/kits/accessories`,
      lastModified: new Date().toISOString(),
    },
  ];

  return [...staticUrls, ...productsDynamicUrls];
}



sitemap()
  .then(async (data) => {

    // Convert the sitemap array to XML format
    const xmlContent = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${data.map((url) => 
          `          <url>
            <loc>${url.url}</loc>
            <lastmod>${url.lastModified}</lastmod>
          </url>`
          )
          .join("\n")}
      </urlset>
    `.trim();

    // Define the path where to save the sitemap
    const filePath = path.join(process.cwd(), "public", "sitemap.xml");

    // Write to sitemap.xml file
    await writeFile(filePath, xmlContent, "utf8");
    console.log(`Sitemap saved to ${filePath}`);
  })
  .catch(console.error);