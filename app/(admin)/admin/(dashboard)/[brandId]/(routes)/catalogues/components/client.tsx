"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { CataloguesColumn, columns } from "./columns";
import { Heading } from "@/app/(admin)/admin/components/ui/heading";
import { DataTable } from "@/app/(admin)/admin/components/ui/data-table";

interface CataloguesClientProps {
  data: CataloguesColumn[];
  userRole: boolean
}

export const CataloguesClient: React.FC<CataloguesClientProps> = ({
  data,
  userRole
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Catalogues (${data.length})`} description="Manage All Catalogues" />
        <Button onClick={() => router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/catalogues/new`)} variant={'secondary'} className="bg-green-500 text-white hover:bg-green-600 transition-colors">
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
