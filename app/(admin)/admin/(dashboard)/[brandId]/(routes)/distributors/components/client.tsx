"use client";

import { DataTable } from "@/app/(admin)/admin/components/ui/data-table";
import { Heading } from "@/app/(admin)/admin/components/ui/heading";
import { Separator } from "@/app/(admin)/admin/components/ui/separator";

import { DistributorsColumn, columns } from "./columns";
import { Button } from "@/app/(admin)/admin/components/ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface DistributorsClientProps {
  data: DistributorsColumn[];
}

export const DistributorsClient: React.FC<DistributorsClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Distributors (${data.length})`} description="Manage Distributors for All Brands" />
        <Button onClick={() => router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/distributors/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
