"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/app/(admin)/admin/components/ui/button";
import { DataTable } from "@/app/(admin)/admin/components/ui/data-table";
import { Heading } from "@/app/(admin)/admin/components/ui/heading";
import { Separator } from "@/app/(admin)/admin/components/ui/separator";

import { ChildSpecColumn, columns } from "./columns";
import React from "react";

interface ChildSpecClientProps {
  data: ChildSpecColumn[];
};

export const ChildSpecClient: React.FC<ChildSpecClientProps> = ({
  data,
}) => {
  const params = useParams();
  const router = useRouter();
  let sentData: ChildSpecColumn[] = data;


  return (
    <> 
      <div className="flex items-center justify-between">
        <Heading title={`Child Specifications (${sentData.length})`} description="Manage Child Specifications" />
        <Button onClick={() => router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/childspec/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={sentData} />
    </>
  );
};
