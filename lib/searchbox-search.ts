import type { Searchbox } from "@/app/(frontend)/types";
import Fuse from "fuse.js";

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .replace(/(\d)½/g, "$1.5")
    .replace(/½/g, "1/2")
    .replace(/(\d+)\s*[- ]?\s*1\/2/g, (_, number: string) => `${number}.5`)
    .replace(/["“”‟″‶〃״˝ʺ˶ˮײ']/g, "inch")
    .replace(/\binches?\b/g, "inch")
    .replace(/(\d)p(?=[\s-]*\d)/g, "$1")
    .replace(/[^a-z0-9.]+/g, "");
}

function getSearchFields(product: Searchbox): string[] {
  return [
    product.label,
    product.slug,
    product.name,
    product.info,
    ...product.size,
    ...product.cat,
    ...product.subcat,
    ...product.subsubcat,
    ...product.productInKits,
  ].map(normalizeSearchText).filter(Boolean);
}

export function rankSearchboxProducts(products: Searchbox[], query: string): Searchbox[] {
  const normalizedQuery = normalizeSearchText(query.trim());
  if (!normalizedQuery) return [];

  const queryTokens = query.trim().split(/\s+/).map(normalizeSearchText).filter(Boolean);
  const ranked = products.flatMap((product, index) => {
    const fields = getSearchFields(product);
    const primaryFields = [product.label, product.slug, product.name]
      .map(normalizeSearchText)
      .filter(Boolean);
    const exactMatch = primaryFields.some((field) => field === normalizedQuery);
    const prefixLength = Math.min(
      ...primaryFields
        .filter((field) => field.startsWith(normalizedQuery))
        .map((field) => field.length - normalizedQuery.length),
      Number.POSITIVE_INFINITY
    );
    const prefixMatch = Number.isFinite(prefixLength);
    const substringMatch = primaryFields.some((field) => field.includes(normalizedQuery));
    const allPrimaryTokensMatch = queryTokens.every((token) =>
      primaryFields.some((field) => field.includes(token))
    );
    const allFieldsTokensMatch = queryTokens.every((token) =>
      fields.some((field) => field.includes(token))
    );

    let score = 0;
    if (exactMatch) score = 1000;
    else if (prefixMatch) score = 850 - prefixLength;
    else if (substringMatch) score = 700;
    else if (allPrimaryTokensMatch) score = 600;
    else if (allFieldsTokensMatch) score = 400;

    return score > 0 ? [{ product, score, index }] : [];
  });

  if (ranked.length === 0 && normalizedQuery.length > 1) {
    const fuzzyMatches = new Fuse(
      products.map((product, index) => ({
        product,
        index,
        searchText: [product.label, product.slug, product.name]
          .map(normalizeSearchText)
          .join(" "),
      })),
      {
        keys: ["searchText"],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
        includeScore: true,
      }
    ).search(normalizedQuery);

    for (const match of fuzzyMatches) {
      ranked.push({
        product: match.item.product,
        score: 300 - (match.score ?? 0) * 100,
        index: match.item.index,
      });
    }
  }

  return ranked
    .sort((a, b) => {
      const aIsKit = a.product.size.some((size) => size.toLowerCase().includes("kit"));
      const bIsKit = b.product.size.some((size) => size.toLowerCase().includes("kit"));
      if (aIsKit !== bIsKit) return aIsKit ? 1 : -1;

      const aIsOEM = a.product.subcat.some((category) => category.toLowerCase().includes("oem"));
      const bIsOEM = b.product.subcat.some((category) => category.toLowerCase().includes("oem"));
      if (aIsOEM !== bIsOEM) return aIsOEM ? 1 : -1;

      return b.score - a.score
        || a.product.label.localeCompare(b.product.label)
        || a.index - b.index;
    })
    .map(({ product }) => product);
}
