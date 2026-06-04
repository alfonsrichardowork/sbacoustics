import prismadb from "@/lib/prismadb";
import { UserForm } from "./components/user-role-form";


const UserPage = async (
  props: {
    params: Promise<{ userId: string }>
  }
) => {
  const params = await props.params;
  const user_role = await prismadb.roles.findMany({
    where: {
      userId: params.userId
    }
  });

  const user_name = await prismadb.users.findFirst({
    where:{
      id: params.userId
    },
    select:{
      name: true
    }
  })

  const all_brands = await prismadb.brand.findMany({})

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UserForm initialData={user_role} allBrands={all_brands} userId={params.userId} name={user_name!.name}/>
      </div>
    </div>
  );
}

export default UserPage;
