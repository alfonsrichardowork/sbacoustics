import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { roles } from "@prisma/client";
import { UserColumn } from "./components/columns";
import { UsersClient } from "./components/client";
import { getSession } from "@/lib/actions";

const UserSettingPage = async () => {
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/admin")
  }

  const user = await prismadb.users.findMany({
    where: {
      name: {
        not: session.username
      }
    }
  });

  if (!user) {
    redirect(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/`);
  }

  const userIds = user.map(one_user => one_user.id);

  const roles: roles[] = await prismadb.roles.findMany({
    where: {
      userId: {
        in: userIds
      }
    }
  });

  let allNames: string[] = []

  user.forEach((each_user, index)=>{
    let tempString = ''
    roles.forEach((role, index2)=> {
      if(role.userId === each_user.id){
        if(index2===0){
          tempString+="| "
        }
        tempString+=role.brandName
        tempString+=" | "
      }
    })
    allNames[index] = tempString
  })
  

  const formattedUsers: UserColumn[] = user.map((oneUser, index) => ({
    id: oneUser.id,
    name: oneUser.name,
    username: oneUser.email,
    privilages: allNames[index] ?? '',
  }));

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UsersClient data={formattedUsers} />
      </div>
    </div>
  );
};

export default UserSettingPage;
