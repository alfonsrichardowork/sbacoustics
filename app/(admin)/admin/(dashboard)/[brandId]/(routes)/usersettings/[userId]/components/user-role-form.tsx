"use client"

import { useEffect, useState } from "react"
import { brand, roles } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/app/(admin)/admin/components/ui/button"

import { Separator } from "@/app/(admin)/admin/components/ui/separator"
import { Heading } from "@/app/(admin)/admin/components/ui/heading"
import { Checkbox } from "@/app/(admin)/admin/components/ui/checkbox"
import axios from "axios"
import toast from "react-hot-toast"

interface UserFormProps {
  initialData: roles[] | null;
  allBrands: brand[] | null;
  userId: string;
  name: String;
};

export const UserForm: React.FC<UserFormProps> = ({
  initialData, allBrands, userId, name
}) => {
  const params = useParams();
  const router = useRouter();
  const [allSelectedRoles, setAllSelectedRoles] = useState<roles[]>([]);
  const [loading, setLoading] = useState(false);
  const [allChecked, setAllChecked] = useState<boolean[]>([]);
  
  const title = initialData ? 'Edit Role' : 'Create Role';
  const description = `For ${name}`;
  const toastMessage = initialData ? 'Role updated.' : 'Role created.';
  const action = initialData ? 'Save changes' : 'Create';
  
  useEffect(() => {
    const checkedState = allBrands?.map((brand) => 
      initialData?.some((data) => data.brandName === brand.name) || false
    ) || [];
    setAllChecked(checkedState);
    setAllSelectedRoles(initialData || []);
  }, [initialData, allBrands]);
  
  function addBrands(id: string, name: string, index: number){
    const updatedCheckedState = [...allChecked];
    const updatedRoles = [...allSelectedRoles];
    
    if (updatedCheckedState[index]) {
      updatedCheckedState[index] = false;
      const roleIndex = updatedRoles.findIndex(role => role.brandId === id);
      if (roleIndex !== -1) {
        updatedRoles.splice(roleIndex, 1);
      }
    } else {
      updatedCheckedState[index] = true;
      updatedRoles.push({
        id: '-',
        userId: userId,
        brandId: id,
        brandName: name
      });
    }
    
    setAllChecked(updatedCheckedState);
    setAllSelectedRoles(updatedRoles);
  }
 
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      
      if (allSelectedRoles.length === 0) {
        let tempRole: roles[] = [{
          id: '0',
          userId: userId,
          brandId: '0',
          brandName: '0'
        }] 
        setAllSelectedRoles(tempRole)
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/user/role/${userId}`, allSelectedRoles);
      if(response.data === 'expired_session'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/`);
        router.refresh();
        toast.error("Session expired, please login again")
      }
      else if(response.data === 'invalid_token'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/`);
        router.refresh();
        toast.error("API Token Invalid, please login again")
      }
      else if(response.data === 'not_admin'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/`);
        router.refresh();
        toast.error("Unauthorized!")
      }
      router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/usersettings`);
      router.refresh();
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <div key={"1"} className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
        <form onSubmit={handleSubmit} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8" key={"1"}>
            {allBrands?.map((brand, index) => (
              <div key={index} className="items-top flex space-x-2 bg-background shadow-lg rounded-lg p-4 border">
                <Checkbox 
                  id={`${index}`} 
                  onClick={() => addBrands(brand.id, brand.name, index)}
                  checked={allChecked[index]}
                />
                <div className="grid gap-1.5 leading-none" key={index}>
                  <label
                    htmlFor={`terms${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {brand.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
          <Button disabled={loading} className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors" type="submit">
            {action}
          </Button>
        </form>
    </>
  );
};
