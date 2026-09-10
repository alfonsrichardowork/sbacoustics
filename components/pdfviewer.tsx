"use client"

import { Document, Page } from "react-pdf";
import { useState } from "react";
import { LazyImageCustomNavbar } from "./lazyImageCustomNavbar";

interface DatasheetViewerProps {
  url: string;
  name: string;
}

const all_desc_style = "text-left xl:text-base sm:text-sm text-xs text-black p-0 py-1"

export default function DatasheetViewer({
  url,
  name,
}: DatasheetViewerProps) {
  const [showPDF, setShowPDF] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowPDF(true)}
        className={`${all_desc_style} font-bold flex items-center hover:text-primary`} data-testid={`multiple-datasheet-0-single-product-page`}
      >
        <LazyImageCustomNavbar src={'/images/sbacoustics/PDF-download-ver2.webp'} alt="PDF Download" classname="max-h-8 w-auto flex-shrink-0" width={100} height={100} lazy containerheight="h-8" containerwidth="w-8"/>
            <h3 className="pl-2">
                {name}
            </h3>
      </div>

      {showPDF && (
        <>
            <h1>{name}</h1>

            <Document file={url}>
                <Page pageNumber={1} />
            </Document>
        </>
      )}
    </>
  );
}