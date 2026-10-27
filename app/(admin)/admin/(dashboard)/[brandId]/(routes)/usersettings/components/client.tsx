"use client";

import { DataTable } from "@/app/(admin)/admin/components/ui/data-table";
import { Heading } from "@/app/(admin)/admin/components/ui/heading";
import { Separator } from "@/app/(admin)/admin/components/ui/separator";

import { UserColumn, columns } from "./columns";

interface UsersClientProps {
  data: UserColumn[];
}

export const UsersClient: React.FC<UsersClientProps> = ({
  data
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Users (${data.length})`} description="Manage User Privilages" />
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
