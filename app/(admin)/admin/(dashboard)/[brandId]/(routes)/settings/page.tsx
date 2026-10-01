import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

import { SettingsForm } from "./components/settings-form";
import { getSession } from "@/lib/actions";

async function getData(brandId: string){
  const brand = await prismadb.brand.findFirst({
    where: {
      id: brandId
    },
    include: {
      aboutUsImages: true
    }
  });

  const socialmedia = await prismadb.socialmedia.findMany({
    where: {
      brandId: brandId
    }
  });
  return [brand, socialmedia] as const;
}

const SettingsPage = async (
  props: {
    params: Promise<{ brandId: string }>
  }
) => {
  const params = await props.params;
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const [brand, socialmedia] = await getData(params.brandId)

  if (!brand) {
    redirect(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/`);
  }

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={brand} initialSocialMedia={socialmedia}/>
      </div>
    </div>
  );
}

export default SettingsPage;
