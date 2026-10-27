"use client";

import { BrandModal } from "@/app/(admin)/admin/components/modals/brand-modal";
import { useEffect, useState } from "react";


export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <BrandModal />
    </>
  );
}
