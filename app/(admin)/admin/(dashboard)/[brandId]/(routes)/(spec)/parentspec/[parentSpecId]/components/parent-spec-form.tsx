"use client"

import * as z from "zod"
import axios, { AxiosResponse } from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { dynamicspecificationparent } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/app/(admin)/admin/components/ui/input"
import { Button } from "@/app/(admin)/admin/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/(admin)/admin/components/ui/form"
import { Separator } from "@/app/(admin)/admin/components/ui/separator"
import { Heading } from "@/app/(admin)/admin/components/ui/heading"

const formSchema = z.object({
  name: z.string().min(1),
});

type ParentSpecFormValues = z.infer<typeof formSchema>

interface ParentSpecFormProps {
  initialData: dynamicspecificationparent | null;
};

export const ParentSpecForm: React.FC<ParentSpecFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Parent Specification' : 'Create Parent Specification';
  const description = initialData ? `For ${initialData.name}` : 'Add a new Parent Specification';
  const toastMessage = initialData ? 'Parent Specification updated.' : 'Parent Specification created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData ? {
    ...initialData,
  } : {
    name: '',
  }


  const form = useForm<ParentSpecFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ParentSpecFormValues) => {
    try {
      setLoading(true);
    
      let response: AxiosResponse;
      if (initialData) {
        response = await axios.patch(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/parentspec/${params.parentSpecId}`, data);
      } else {
        response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/parentspec`, data);
      }
      if(response.data === 'duplicate'){
        toast.error("Duplicate Parent Spec")
      }
      else if(response.data === 'expired_session'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/`);
        router.refresh();
        toast.error("Session expired, please login again");
      }
      else if(response.data === 'invalid_token'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/`);
        router.refresh();
        toast.error("API Token Invalid, please login again");
      }
      else if(response.data === 'unauthorized'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/`);
        router.refresh();
        toast.error("Unauthorized!");
      }
      else{
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/parentspec`);
        router.refresh();
        toast.success(toastMessage);
      }
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  
  return (  
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("validation errors:", errors);
        })} className="space-y-4 w-full">
          
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


          <div className="gap-4 border rounded-lg p-4 shadow-lg bg-background">
            <div className="pb-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-base">Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Parent Specification name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

          <Button disabled={loading} type="submit" className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
