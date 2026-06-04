"use client";

import * as z from "zod"
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState } from "react";

import { Input } from "@/app/(admin)/admin/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/(admin)/admin/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/(admin)/admin/components/ui/card";
import { Button } from "@/app/(admin)/admin/components/ui/button";
import Image from "next/image";
import ScrollingLogos from "@/app/(admin)/admin/components/scrolling-logos";
import { sampleLogos } from "@/lib/sample-logos";

const formSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export default function Page () {

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/user/login`, values);
      window.location.assign(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/`);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data || 'An error occurred');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="space-y-4 py-2 pb-4 max-w-lg mx-auto">
          <div className="bg-white/50 backdrop-blur-xs p-4 rounded-lg shadow-xl">
          <div className="container mx-auto px-6 py-4">
            <ScrollingLogos logos={sampleLogos} />
          </div>
          <Card className="mx-auto w-full bg-transparent border-none flex flex-col justify-center">
            <CardHeader>
              <CardTitle className="text-lg w-full flex items-center justify-center">Welcome to the Admin Page!</CardTitle>
              {/* <CardDescription className="text-black/70">
                Please enter your credentials to continue.
              </CardDescription> */}
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base">Username</FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="Input your username" {...field} className="bg-white" />
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
                        <FormLabel className="font-bold text-base">Password</FormLabel>
                        <FormControl>
                          <Input disabled={loading} type="password" placeholder="********" {...field} className="bg-white"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                    <Button disabled={loading} type="submit" className="w-full">Login</Button>
                  </div>
                </form>
              </Form> 
            </CardContent>
          </Card>
          </div>
        </div>
  );
};






// "use client";

// import * as z from "zod"
// import axios, { AxiosError } from "axios";
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form";
// import { toast } from "react-hot-toast";
// import { useState } from "react";

// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/(admin)/admin/components/ui/form";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/(admin)/admin/components/ui/card";
// import Image from "next/image";
// import { Input } from "@/app/(admin)/admin/components/ui/input";
// import { Button } from "@/app/(admin)/admin/components/ui/button";

// const formSchema = z.object({
//   email: z.string().min(1),
//   password: z.string().min(1),
// });

// export default function Page () {

//   const [loading, setLoading] = useState(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: ""
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       setLoading(true);
//       await axios.patch(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_USER_LOGIN}`, values);
//       window.location.assign(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/`);
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         toast.error(error.response?.data || 'An error occurred');
//       } else {
//         toast.error('An unexpected error occurred');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//       <div className="grid grid-cols-1 items-center justify-center h-full w-full">
//         <div className="hidden md:flex flex-col items-center justify-center space-y-16">
//           <div className="grid grid-cols-2 justify-center items-center space-x-16">
//             <div>
//               <Image
//                 src={"/images/admin/logo_sbacoustics_black_clean.webp"}
//                 alt="Logo SB Acoustics"
//                 width={250}
//                 height={120}
//                 className="drop-shadow-lg"
//               />
//             </div>
//             <div>
//               <Image
//                 src={"/images/admin/logo_sbaudience_black.webp"}
//                 alt="Logo SB Audience"
//                 width={250}
//                 height={120}
//                 className="drop-shadow-lg"
//               />
//             </div>
//           </div>
//           <div>
//             <Image
//               src={"/images/admin/logo_sbautomotive_black.webp"}
//               alt="Logo SB Automotive"
//               width={250}
//               height={120}
//                 className="drop-shadow-lg"
//             />
//           </div>
//         </div>
//         <div className="w-full flex justify-center">
//           <div className="bg-white/30 backdrop-blur-xs p-4 rounded-lg shadow-xl">
//           <Card className="mx-auto max-w-sm bg-transparent border-none">
//             <CardHeader className="flex flex-col items-center space-y-2">
//               <CardTitle className="text-xl whitespace-nowrap">Welcome to the Admin Page!</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
//                   <FormField
//                     control={form.control}
//                     name="email"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Username</FormLabel>
//                         <FormControl>
//                           <Input disabled={loading} placeholder="Input your username" className="bg-white shadow-md" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="password"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Password</FormLabel>
//                         <FormControl>
//                           <Input disabled={loading} type="password" placeholder="********" className="bg-white shadow-md" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <div className="pt-6 space-x-2 flex items-center justify-end w-full">
//                     <Button disabled={loading} type="submit" variant={'default'} className="w-full">Login</Button>
//                   </div>
//                 </form>
//               </Form> 
//             </CardContent>
//           </Card>
//           </div>
//         </div>
//       </div>
//   );
// };

