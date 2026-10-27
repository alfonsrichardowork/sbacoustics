"use client";

import { ApiAlert } from "@/app/(admin)/admin/components/ui/api-alert";
import { useOrigin } from "@/app/(admin)/admin/hooks/use-origin";
import { useParams } from "next/navigation";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}

export const ApiList: React.FC<ApiListProps> = ({
  entityName,
  entityIdName,
}) => {
  const params = useParams();
  const origin = useOrigin();
  const baseUrl = `${origin}${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}`;

  return (
    <>
      <ApiAlert title="GET" variant="public" description={`${baseUrl}/${entityName}`} />
      <ApiAlert title="GET" variant="public" description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
      {/* <ApiAlert title="POST" variant="admin" description={`${baseUrl}/${entityName}`} />
      <ApiAlert title="PATCH" variant="admin" description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
      <ApiAlert title="DELETE" variant="admin" description={`${baseUrl}/${entityName}/{${entityIdName}}`} /> */}
    </>
  );
};
