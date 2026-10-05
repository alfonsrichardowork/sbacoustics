"use server"
import fs from "node:fs/promises";
import path from "path";
import { checkBearerAPI, getSession } from "@/lib/actions";
import { MAX_FILE_SIZE } from "./lib";

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".zip",
  ".step",
  ".stp"
];

const ALLOWED_TYPES_BY_EXTENSION: Record<string, string[]> = {
  ".pdf": ["application/pdf"],
  ".zip": ["application/zip", "application/x-zip-compressed", "application/octet-stream"],
  ".step": ["application/step", "application/sla", "application/octet-stream"],
  ".stp": ["application/step", "application/sla", "application/octet-stream"],
};

const ALLOWED_FOLDERS = [
  "3dmodels",
  "applicationdatasheet", 
  "catalogues", 
  "frdzmafiles",
  "productdatasheet", 
  "technicals",
  "other"
];

function hasErrorCode(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}

async function writeUniqueFile(dir: string, originalName: string, buffer: Uint8Array): Promise<string> {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);
  let counter = 0;

  while (true) {
    const filename = counter === 0 ? originalName : `${base}-${counter}${ext}`;
    try {
      await fs.writeFile(path.join(dir, filename), buffer, { flag: "wx" });
      return filename;
    } catch (error) {
      if (!hasErrorCode(error, "EEXIST")) throw error;
      counter++;
    }
  }
}

export async function uploadFile(formData: FormData, folder: string) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    throw new Error("Please sign in before uploading files");
  }
  if (!(await checkBearerAPI(session))) {
    session.destroy();
    throw new Error("Your session is no longer valid");
  }

  if (!ALLOWED_FOLDERS.includes(folder)) {
    throw new Error("Invalid folder");
  }
  const value = formData.get("file");
  if (typeof File === "undefined" || !(value instanceof File) || value.size === 0) {
    throw new Error("A non-empty file is required");
  }

  const file = value;
  if ((folder === "catalogues" || folder === "applicationdatasheet") && file.size > MAX_FILE_SIZE) {
    throw new Error("Files must be 50 MB or smaller");
  }

  const extension = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    throw new Error("Invalid file extension");
  }
  if (!ALLOWED_TYPES_BY_EXTENSION[extension]?.includes(file.type)) {
    throw new Error("File type does not match its extension");
  }
  if (folder === "applicationdatasheet" && extension !== ".pdf") {
    throw new Error("Application datasheets must be PDF files");
  }

  const safeBase = path.basename(file.name, path.extname(file.name))
    .replace(/[^a-zA-Z0-9 _.-]/g, "_")
    .replace(/^\.+$/, "file")
    .slice(0, 180);
  const safeName = `${safeBase || "file"}${extension}`;
  const buffer = new Uint8Array(await file.arrayBuffer());
  if (folder === "applicationdatasheet" && !new TextDecoder().decode(buffer.subarray(0, 1024)).includes("%PDF-")) {
    throw new Error("Application datasheets must contain a valid PDF header");
  }

  const uploadDir = path.join(process.cwd(), "uploads", folder);
  await fs.mkdir(uploadDir, { recursive: true });
  const uniqueFilename = await writeUniqueFile(uploadDir, safeName, buffer);

  return `/uploads/${folder}/${uniqueFilename}`;
}
