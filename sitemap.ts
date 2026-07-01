import { MetadataRoute } from "next";
import "dotenv/config"; // Load .env.local variables
import { writeFile } from "fs/promises";
import path from "path";
import prismadb from "./lib/prismadb";

async function getProductsDynamicUrls() {
  const SBAcousticsProducts = await prismadb.product.findMany({
    where: {
      brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
    },
    select: { slug: true },
  });
  const SBAudienceProducts = await prismadb.product.findMany({
    where: {
      brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
    },
    select: { slug: true },
  });
  return [
    ...SBAcousticsProducts.map((product: { slug: string }) => ({
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/products/${product.slug}`,
      lastModified: new Date().toISOString(),
    })),
    ...SBAudienceProducts.map((product: { slug: string }) => ({
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sbaudience/products/${product.slug}`,
      lastModified: new Date().toISOString(),
    }))
  ];
}

async function getSBAcousticsDriversDynamicUrls() {
  const connectors = await prismadb.allproductcategory.findMany({
    where: {
      category: {
        brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
      },
      product: {
        brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
      },
    },
    select: {
      productId: true,
      category: {
        select: {
          slug: true,
          type: true,
        },
      },
    },
  });

  const paths = Array.from(
  connectors.reduce((map, row) => {
      const existing = map.get(row.productId) ?? [];

      existing.push({
      slug: row.category.slug,
      type: row.category.type,
      });

      map.set(row.productId, existing);

      return map;
  }, new Map<string, { slug: string; type: string }[]>()).values()
  ).flatMap(categories => {
  const category = categories
      .filter(c => c.type === 'Category')
      .map(c => c.slug);

  const subCategory = categories
      .filter(c => c.type === 'Sub Category')
      .map(c => c.slug);

  const subSubCategory = categories
      .filter(c => c.type === 'Sub Sub Category')
      .map(c => c.slug);

  const result: string[] = [];

  // Category only
  if (!subCategory.length) {
      return category;
  }

  // Category + Sub Category
  for (const cat of category) {
      for (const sub of subCategory) {
      if (!subSubCategory.length) {
          result.push(`${cat}/${sub}`);
      } else {
          // Category + Sub Category + Sub Sub Category
          for (const subSub of subSubCategory) {
          result.push(`${cat}/${sub}/${subSub}`);
          }
      }
      }
  }

  return result;
  });

  const allPaths = new Set<string>();

  for (const path of paths) {
      const parts = path.split('/');

      // Original path
      allPaths.add(path);

      // Level 1 (/drivers)
      if (parts.length >= 1) {
          allPaths.add(parts[0] ?? '');
      }

      // Level 2 (/drivers/midranges)
      if (parts.length >= 2) {
          allPaths.add(parts.slice(0, 2).join('/'));
      }
  }

  const uniqueSortedPaths = [...allPaths].sort((a, b) => {
    const depthA = a.split('/').length;
    const depthB = b.split('/').length;

    if (depthA !== depthB) {
        return depthA - depthB;
    }

    return a.localeCompare(b);
  });
  return uniqueSortedPaths.map((product) => ({
    url: `${process.env.NEXT_PUBLIC_ROOT_URL}/${product}`,
    lastModified: new Date().toISOString(),
  }))
}

async function getSBAudienceDriversDynamicUrls() {
  const connectors = await prismadb.allproductcategory.findMany({
    where: {
      category: {
        brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
      },
      product: {
        brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
      },
    },
    select: {
      productId: true,
      category: {
        select: {
          slug: true,
          type: true,
        },
      },
    },
  });

  const paths = Array.from(
  connectors.reduce((map, row) => {
      const existing = map.get(row.productId) ?? [];

      existing.push({
      slug: row.category.slug,
      type: row.category.type,
      });

      map.set(row.productId, existing);

      return map;
  }, new Map<string, { slug: string; type: string }[]>()).values()
  ).flatMap(categories => {
  const category = categories
      .filter(c => c.type === 'Category')
      .map(c => c.slug);

  const subCategory = categories
      .filter(c => c.type === 'Sub Category')
      .map(c => c.slug);

  const subSubCategory = categories
      .filter(c => c.type === 'Sub Sub Category')
      .map(c => c.slug);

  const result: string[] = [];

  // Category only
  if (!subCategory.length) {
      return category;
  }

  // Category + Sub Category
  for (const cat of category) {
      for (const sub of subCategory) {
      if (!subSubCategory.length) {
          result.push(`${cat}/${sub}`);
      } else {
          // Category + Sub Category + Sub Sub Category
          for (const subSub of subSubCategory) {
          result.push(`${cat}/${sub}/${subSub}`);
          }
      }
      }
  }

  return result;
  });

  const allPaths = new Set<string>();

  for (const path of paths) {
      const parts = path.split('/');

      // Original path
      allPaths.add(path);

      // Level 1 (/drivers)
      if (parts.length >= 1) {
          allPaths.add(parts[0] ?? '');
      }

      // Level 2 (/drivers/midranges)
      if (parts.length >= 2) {
          allPaths.add(parts.slice(0, 2).join('/'));
      }
  }

  const uniqueSortedPaths = [...allPaths].sort((a, b) => {
    const depthA = a.split('/').length;
    const depthB = b.split('/').length;

    if (depthA !== depthB) {
        return depthA - depthB;
    }

    return a.localeCompare(b);
  });
  return uniqueSortedPaths.map((product) => ({
    url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sbaudience/${product}`,
    lastModified: new Date().toISOString(),
  }))
}

async function getSBAudienceApplicationsDynamicUrls() {
  const app = await prismadb.sbaudienceapplication.findMany({
    where: {
      brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
    },
    select: { slug: true },
  });
  return app.map((singleapp: { slug: string }) => ({
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sbaudience/application/${singleapp.slug}`,
      lastModified: new Date().toISOString(),
    }))
}


// Generate the sitemap dynamically
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productsDynamicUrls = await getProductsDynamicUrls();
  const SBAcousticsDriversDynamicUrls = await getSBAcousticsDriversDynamicUrls();
  const SBAudienceDriversDynamicUrls = await getSBAudienceDriversDynamicUrls();
  const SBAudienceApplicationsDynamicUrls = await getSBAudienceApplicationsDynamicUrls();

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
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/products`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/drivers/all`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/kits/all`,
      lastModified: new Date().toISOString(),
    },
  ];

  const staticUrlsSBAudience = [
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sbaudience`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sbaudience/aboutus`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sbaudience/catalogues`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sbaudience/contact`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sbaudience/distributors`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sbaudience/new-products`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sbaudience/products`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sbaudience/drivers/all`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/sbaudience/application`,
      lastModified: new Date().toISOString(),
    },
  ];

  return [...staticUrls, ...staticUrlsSBAudience, ...productsDynamicUrls, ...SBAcousticsDriversDynamicUrls, ...SBAudienceDriversDynamicUrls, ...SBAudienceApplicationsDynamicUrls].sort((a, b) => {
    return a.url.localeCompare(b.url);
  });
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