"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/app/(admin)/admin/components/ui/button";
import { Heading } from "@/app/(admin)/admin/components/ui/heading";
import { Separator } from "@/app/(admin)/admin/components/ui/separator";
import { ApiList } from "@/app/(admin)/admin/components/ui/api-list";

import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/app/(admin)/admin/components/ui/data-table";

interface CategoriesClientProps {
  data: CategoryColumn[];
  userRole: boolean;
}

export const CategoriesClient: React.FC<CategoriesClientProps> = ({
  data,
  userRole
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Category (${data.length})`} description="Manage Category for your products" />
        <Button onClick={() => router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/category/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      {/* {userRole? (<>
        <Heading title="API" description="API Calls for Category" />
        <Separator />
        <ApiList entityName="category" entityIdName="categoryId" />
      </>)
        : 
        (<></>)
      } */}
    </>
  );
};
