"use client";

import { Bold, Italic, Plus, Underline } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/app/(admin)/admin/components/ui/button";
import { DataTable } from "@/app/(admin)/admin/components/ui/data-table";
import { Heading } from "@/app/(admin)/admin/components/ui/heading";
import { Separator } from "@/app/(admin)/admin/components/ui/separator";
import { ApiList } from "@/app/(admin)/admin/components/ui/api-list";

import { ProductColumn, columns } from "./columns";
import { ToggleGroup, ToggleGroupItem } from "@/app/(admin)/admin/components/ui/toggle-group";
import React from "react";

interface ProductsClientProps {
  data: ProductColumn[];
  userRole: boolean
};

export const ProductsClient: React.FC<ProductsClientProps> = ({
  data,
  userRole
}) => {
  const [filter, setFilter] = React.useState('All')
  const params = useParams();
  const router = useRouter();
  let sentData: ProductColumn[] = data;
  if(filter === 'All'){
    sentData = data
  }
  else if(filter === 'Active'){
    sentData = data.filter(item => item.isArchived === false)
  }
  else if(filter === 'Archived'){
    sentData = data.filter(item => item.isArchived === true)
  }
  else if(filter === 'Featured'){
    sentData = data.filter(item => item.isFeatured === true)
  }
  else if(filter === 'Drivers'){
    sentData = data.filter(item => item.isKits === false)
  }
  else if(filter === 'Kits'){
    sentData = data.filter(item => item.isKits === true)
  }

  return (
    <> 
      <div className="flex items-center justify-between">
        <Heading title={`All ${filter != 'All' ? `${filter} ` : ''}Products (${sentData.length})`} description="Manage products for your brand" />
        <Button onClick={() => router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/products/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
<ToggleGroup
  type="single"
  value={filter}
  onValueChange={(value) => setFilter(value || "All")}
>
  <ToggleGroupItem
    value="All"
    className="data-[state=on]:bg-primary data-[state=on]:text-background hover:bg-primary hover:text-background transition"
  >
    All
  </ToggleGroupItem>

  <ToggleGroupItem
    value="Active"
    className="data-[state=on]:bg-primary data-[state=on]:text-background hover:bg-primary hover:text-background transition"
  >
    Active
  </ToggleGroupItem>

  <ToggleGroupItem
    value="Archived"
    className="data-[state=on]:bg-primary data-[state=on]:text-background hover:bg-primary hover:text-background transition"
  >
    Archived
  </ToggleGroupItem>

  <ToggleGroupItem
    value="Featured"
    className="data-[state=on]:bg-primary data-[state=on]:text-background hover:bg-primary hover:text-background transition"
  >
    Featured
  </ToggleGroupItem>
  
  <ToggleGroupItem
    value="Drivers"
    className="data-[state=on]:bg-primary data-[state=on]:text-background hover:bg-primary hover:text-background transition"
  >
    Drivers Only
  </ToggleGroupItem>

  <ToggleGroupItem
    value="Kits"
    className="data-[state=on]:bg-primary data-[state=on]:text-background hover:bg-primary hover:text-background transition"
  >
    Kits Only
  </ToggleGroupItem>
</ToggleGroup>
        <DataTable searchKey="name" columns={columns} data={sentData} />
      {/* {userRole? (<>
        <Heading title="API" description="API Calls for Products" />
        <Separator />
        <ApiList entityName="products" entityIdName="productId" />
      </>)
        : 
        (<></>)
      } */}
    </>
  );
};
