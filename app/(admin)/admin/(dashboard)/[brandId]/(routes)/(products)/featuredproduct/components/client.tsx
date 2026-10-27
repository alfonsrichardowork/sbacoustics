"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/app/(admin)/admin/components/ui/button";
import { DataTable } from "@/app/(admin)/admin/components/ui/data-table";
import { Heading } from "@/app/(admin)/admin/components/ui/heading";
import { Separator } from "@/app/(admin)/admin/components/ui/separator";
import { ApiList } from "@/app/(admin)/admin/components/ui/api-list";

import { columns, FeaturedProductColumn } from "./columns";

interface FeaturedProductClientProps {
  data: FeaturedProductColumn[];
  userRole: boolean
}

export const FeaturedProductClient: React.FC<FeaturedProductClientProps> = ({
  data,
  userRole
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Featured Products (${data.length})`} description="Manage Background Picture for Your Featured Products" />
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      {/* {userRole? (<>
        <Heading title="API" description="API Calls for Featured Products" />
        <Separator />
        <ApiList entityName="featuredproducts" entityIdName="featuredProductId" />
      </>)
        : 
        (<></>)
      } */}
    </>
  );
};
