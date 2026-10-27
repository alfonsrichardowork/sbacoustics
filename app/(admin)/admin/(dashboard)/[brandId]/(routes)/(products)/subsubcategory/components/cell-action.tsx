"use client";

import axios from "axios";
import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/app/(admin)/admin/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger
} from "@/app/(admin)/admin/components/ui/dropdown-menu";
import { AlertModal } from "@/app/(admin)/admin/components/modals/alert-modal";

import { SubSubCategoryColumn } from "./columns";

interface CellActionProps {
  data: SubSubCategoryColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
}) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/subsubcategory/${data.id}`);
      if(response.data === 'stillused'){
        window.location.reload()
        toast.error('Make sure you removed all products using this sub sub category first.');
      }
      else if(response.data === 'expired_session'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/`);
        router.refresh();
        toast.error("Session expired, please login again");
      }
      else if(response.data === 'invalid_token'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/`);
        router.refresh();
        toast.error("API Token Invalid, please login again");
      }
      else if(response.data === 'unauthorized'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/`);
        router.refresh();
        toast.error("Unauthorized");
      }
      else{
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/subsubcategory`);
        window.location.reload()
        toast.success('Sub Sub Category deleted.');
      }
    } catch (error) {
      window.location.reload()
      toast.error('Make sure you removed all products using this sub sub category first.');
    } finally {
      setTimeout(() => {
        window.location.reload();
        setOpen(false); 
        setLoading(false);
      }, 2000); 
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Sub Sub Category ID copied to clipboard.');
  }

  return (
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => {
          setOpen(false);
          window.location.reload();
        }}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onCopy(data.id)}
          >
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/subsubcategory/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
