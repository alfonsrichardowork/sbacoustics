"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/app/(admin)/admin/components/ui/button";
import { DataTable } from "@/app/(admin)/admin/components/ui/data-table";
import { Heading } from "@/app/(admin)/admin/components/ui/heading";
import { Separator } from "@/app/(admin)/admin/components/ui/separator";
import { ApiList } from "@/app/(admin)/admin/components/ui/api-list";

import { SubSubCategoryColumn, columns } from "./columns";

interface SubSubCategoriesClientProps {
  data: SubSubCategoryColumn[];
  userRole: boolean;
}

export const SubSubCategoriesClient: React.FC<SubSubCategoriesClientProps> = ({
  data,
  userRole
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Sub Sub Category (${data.length})`} description="Manage Sub Sub Category for your products" />
        <Button onClick={() => router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/subsubcategory/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      {/* {userRole? (<>
        <Heading title="API" description="API Calls for Sub Sub Category" />
        <Separator />
        <ApiList entityName="subsubcategory" entityIdName="subSubCategoryId" />
      </>)
        : 
        (<></>)
      } */}
    </>
  );
};
