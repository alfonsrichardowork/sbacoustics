export function getHref(pathname: string, slug: string) {
  const normalizedSlug = slug.startsWith("/") ? slug : `/${slug}`;

  return pathname.includes("sbaudience")
    ? `/sbaudience${normalizedSlug}`
    : pathname.includes("sbautomotive")
    ? `/sbautomotive${normalizedSlug}` : normalizedSlug;
}