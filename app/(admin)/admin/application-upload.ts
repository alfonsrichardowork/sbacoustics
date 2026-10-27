import path from "node:path";

export type ApplicationUploadFolder = "applicationimage" | "applicationdatasheet";

const ALLOWED_EXTENSIONS: Record<ApplicationUploadFolder, Set<string>> = {
  applicationimage: new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tif", ".tiff", ".avif"]),
  applicationdatasheet: new Set([".pdf"]),
};
const ALLOWED_IMAGE_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".bmp", ".tif", ".tiff", ".avif",
]);

export function getSafeApplicationUploadPath(
  url: string,
  folder: ApplicationUploadFolder
): string | null {
  const prefix = `/uploads/${folder}/`;
  if (!url.startsWith(prefix)) return null;

  const filename = url.slice(prefix.length);
  if (
    !filename ||
    filename !== path.basename(filename) ||
    !/^[a-zA-Z0-9 _.-]+$/.test(filename) ||
    !ALLOWED_EXTENSIONS[folder].has(path.extname(filename).toLowerCase())
  ) {
    return null;
  }

  const directory = path.resolve(process.cwd(), "uploads", folder);
  const filePath = path.resolve(directory, filename);
  return path.dirname(filePath) === directory ? filePath : null;
}

export function isSafeApplicationAssetUrl(
  value: unknown,
  folder: ApplicationUploadFolder
): value is string {
  if (typeof value !== "string" || value.length > 2048) return false;
  if (value === "") return true;

  if (value.startsWith("/uploads/")) {
    return getSafeApplicationUploadPath(value, folder) !== null;
  }

  if (value.startsWith("/")) {
    if (value.startsWith("//") || value.includes("\\") || /[\u0000-\u001f]/.test(value)) return false;
    try {
      const decodedPath = decodeURIComponent(value.split(/[?#]/, 1)[0] ?? "");
      return !decodedPath.split("/").some((segment) => segment === "." || segment === "..");
    } catch {
      return false;
    }
  }

  try {
    const url = new URL(value);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export function isSafeApplicationAssetList(
  value: unknown,
  folder: ApplicationUploadFolder
): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (asset) =>
        typeof asset === "object" &&
        asset !== null &&
        "name" in asset &&
        typeof asset.name === "string" &&
        "url" in asset &&
        isSafeApplicationAssetUrl(asset.url, folder)
    )
  );
}

export function getSafeOtherImageUploadPath(url: string): string | null {
  const prefix = "/uploads/other/";
  if (!url.startsWith(prefix)) return null;

  const filename = url.slice(prefix.length);
  if (
    !filename ||
    filename !== path.basename(filename) ||
    !/^[a-zA-Z0-9 _.-]+$/.test(filename) ||
    !ALLOWED_IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase())
  ) {
    return null;
  }

  const directory = path.resolve(process.cwd(), "uploads", "other");
  const filePath = path.resolve(directory, filename);
  return path.dirname(filePath) === directory ? filePath : null;
}

export function isSafeSettingsImageUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048) return false;
  if (value === "") return true;

  if (value.startsWith("/uploads/")) {
    return getSafeOtherImageUploadPath(value) !== null;
  }

  if (value.startsWith("/")) {
    if (value.startsWith("//") || value.includes("\\") || /[\u0000-\u001f]/.test(value)) return false;
    try {
      const decodedPath = decodeURIComponent(value.split(/[?#]/, 1)[0] ?? "");
      return !decodedPath.split("/").some((segment) => segment === "." || segment === "..");
    } catch {
      return false;
    }
  }

  try {
    const url = new URL(value);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export function isSafeSettingsImageList(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (image) =>
        typeof image === "object" &&
        image !== null &&
        "url" in image &&
        isSafeSettingsImageUrl(image.url) &&
        "name" in image &&
        typeof image.name === "string" &&
        "desc" in image &&
        typeof image.desc === "string" &&
        "type" in image &&
        (image.type === "SBE" || image.type === "BRAND" || image.type === "VALUES") &&
        "priority" in image &&
        (typeof image.priority === "string" || image.priority === null)
    )
  );
}
