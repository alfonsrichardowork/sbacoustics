"use client";

import { useEffect } from "react";
import { useBrandModal } from "@/app/(admin)/admin/hooks/use-brand-modal";


const SetupPage = () => {
  const onOpen = useBrandModal((state) => state.onOpen);
  const isOpen = useBrandModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);
  return null;
};
 
export default SetupPage;
