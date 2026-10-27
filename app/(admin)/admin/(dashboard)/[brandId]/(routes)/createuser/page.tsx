"use client";

import * as z from "zod"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState, use } from "react";

import { Input } from "@/app/(admin)/admin/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/(admin)/admin/components/ui/form";
import { Button } from "@/app/(admin)/admin/components/ui/button";
import { useRouter } from "next/navigation";
import { Heading } from "@/app/(admin)/admin/components/ui/heading";
import { Separator } from "@/app/(admin)/admin/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
  confPassword: z.string().min(1),
});

export default function Page(props:{params: Promise<{brandId: string}>}) {
  const params = use(props.params);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confPassword: ""
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if(values.password !== values.confPassword){
        toast.error('Different Password and Confirmed Password!')
        return
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/user/register`, values, 
      );
      if (response.data === 'taken'){
        toast.error("Username is Taken")
      }
      else if(response.data === 'expired_session'){
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
      else{
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/usersettings`);
        router.refresh();
        toast.success("User Created")
      }

    } catch (error) {
      window.location.reload()
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading title="Register" description="Register New User" />
        </div>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-lg shadow-lg border w-full bg-background">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Input Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Input username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input disabled={loading} type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm your password</FormLabel>
                      <FormControl>
                        <Input disabled={loading} type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button disabled={loading} className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors" type="submit">
              Create User
            </Button>
          </form>
        </Form>   
      </div>
    </div>
  );
};

