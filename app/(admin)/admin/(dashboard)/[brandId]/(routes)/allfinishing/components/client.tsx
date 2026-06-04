"use client";

import { DataTable } from "@/app/(admin)/admin/components/ui/data-table";
import { Heading } from "@/app/(admin)/admin/components/ui/heading";
import { Separator } from "@/app/(admin)/admin/components/ui/separator";

import { FinishingColumn, columns } from "./columns";
import { Button } from "@/app/(admin)/admin/components/ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface FinishingClientProps {
  data: FinishingColumn[];
}

export const FinishingClient: React.FC<FinishingClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`All Finishing (${data.length})`} description="Manage Finishing for SB Acoustics" />
        <Button onClick={() => router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/allfinishing/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
