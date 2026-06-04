"use server"
import fs from "node:fs/promises";
import path from "path";

function sanitizeFilename(name: string) {
  const ext = path.extname(name);
  const base = path.basename(name, ext);

  // Replace unsafe characters with underscore
  const safeBase = base.replace(/[^a-zA-Z0-9 _.-]/g, "_");

  return safeBase + ext;
}

const ALLOWED_TYPES = [
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/step",
  "application/sla",
  "application/octet-stream"
];

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".zip",
  ".step",
  ".stp"
];

const ALLOWED_FOLDERS = [
  "3dmodels",
  "applicationdatasheet", 
  "catalogues", 
  "frdzmafiles",
  "productdatasheet", 
  "technicals",
  "other"
];

async function getUniqueFilename(dir: string, originalName: string): Promise<string> {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);

  if (!ALLOWED_EXTENSIONS.includes(ext.toLowerCase())) {
    throw new Error("Invalid file extension");
  }

  let filename = originalName;
  let counter = 1;

  // Keep looping until we find a non-existing filename
  while (true) {
    try {
      await fs.access(path.join(dir, filename)); // Check if file exists
      filename = `${base}-${counter}${ext}`;      // If exists, increment
      counter++;
    } catch {
      break; // File does not exist → we can use this filename
    }
  }

  return filename;
}

export async function uploadFile(formData: FormData, folder: string) {
  const file = formData.get("file") as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  if (!ALLOWED_FOLDERS.includes(folder)) {
    throw new Error("Invalid folder");
  }
  
  const uploadDir = path.join(process.cwd(), "uploads", folder);

  // Sanitize filename (keep case)
  const safeName = sanitizeFilename(file.name);

  // Find a unique filename by incrementing
  const uniqueFilename = await getUniqueFilename(uploadDir, safeName);

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type");
  }

  const filePath = path.join(uploadDir, uniqueFilename);

  await fs.writeFile(filePath, buffer);

  return `/uploads/${folder}/${uniqueFilename}`;
}
