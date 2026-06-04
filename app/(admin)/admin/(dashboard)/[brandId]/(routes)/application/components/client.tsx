"use client";

import { Bold, Italic, Plus, Underline } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/app/(admin)/admin/components/ui/button";
import { DataTable } from "@/app/(admin)/admin/components/ui/data-table";
import { Heading } from "@/app/(admin)/admin/components/ui/heading";
import { Separator } from "@/app/(admin)/admin/components/ui/separator";
import { ApiList } from "@/app/(admin)/admin/components/ui/api-list";

import { AppColumn, columns } from "./columns";
import { ToggleGroup, ToggleGroupItem } from "@/app/(admin)/admin/components/ui/toggle-group";
import React from "react";

interface AppClientProps {
  data: AppColumn[];
};

export const AppClient: React.FC<AppClientProps> = ({
  data,
}) => {
  const params = useParams();
  const router = useRouter();
  let sentData: AppColumn[] = data;


  return (
    <> 
      <div className="flex items-center justify-between">
        <Heading title={`Applications (${sentData.length})`} description="Manage Application for SB Audience" />
        <Button onClick={() => router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/application/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={sentData} />
    </>
  );
};
