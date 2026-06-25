"use client"

import * as z from "zod"
import axios, { AxiosResponse } from "axios"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { allcategory } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/app/(admin)/admin/components/ui/input"
import { Button } from "@/app/(admin)/admin/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/(admin)/admin/components/ui/form"
import { Separator } from "@/app/(admin)/admin/components/ui/separator"
import { Heading } from "@/app/(admin)/admin/components/ui/heading"
import { MAX_SIZE } from "@/app/(admin)/admin/model/model"
import { uploadImage } from "@/app/(admin)/admin/upload-image"
import Image from "next/image"
import { Checkbox } from "@/app/(admin)/admin/components/ui/checkbox"

const formSchema = z.object({
  name: z.string().min(1),
  singularname: z.string().min(1),
  description: z.string().min(1),
  type: z.string().min(1),
  thumbnail_url: z.string().optional(),
  shown_on_all_drivers_page: z.boolean().default(false).optional(),
});

type SubCategoryFormValues = z.infer<typeof formSchema>

interface SubCategoryFormProps {
  initialData: allcategory | null;
};

export const SubCategoryForm: React.FC<SubCategoryFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [coverImgUrl, setCoverImgUrl] = useState<string>();
  const [coverImg, setCoverImg] = useState<File>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Sub Category' : 'Create Sub Category';
  const description = initialData ? 'Edit a Sub Category.' : 'Add a new Sub Category';
  const toastMessage = initialData ? 'Sub Category updated.' : 'Sub Category created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<SubCategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      singularname: '',
      description: '',
      type: 'Sub Category',
      thumbnail_url: '',
      shown_on_all_drivers_page: false
    }
  });


  useEffect(() => {
    const fetchData = async () => {
      if (initialData && initialData.thumbnail_url) {
        setCoverImgUrl(initialData.thumbnail_url);
      }
      else{
        setCoverImgUrl('')
      }
    };
    
    fetchData().catch((error) => {
      console.error("Error fetching category: ", error);
    });
  }, [initialData, initialData?.thumbnail_url]);
  
    //THUMBNAIL IMAGE
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(!file) return
      if (file.size > MAX_SIZE) {
        alert("File size must be less than 2MB");
        e.target.value = "";
        return;
      }
      setCoverImg(file);
    };
  
    const deleteImage = async () => {
      setCoverImgUrl('')
    }
  
    async function handleCoverImageUpload(file: File): Promise<string> {
      if (file) {
        let updatedCoverImage = coverImgUrl ?? ''
        try {
          const formData = new FormData();
          formData.append('image', file);
    
          const url = await uploadImage(formData, 'other');
          updatedCoverImage = url;
          return updatedCoverImage;
        } catch (error) {
          console.error("Error uploading cover image:", error);
          return '';
        }
      }
      return '';
    }
    
  
  const onSubmit = async (data: SubCategoryFormValues) => {
    try {
      setLoading(true);
      if (coverImg) {
        data.thumbnail_url = await handleCoverImageUpload(coverImg)
      }
      else{
        data.thumbnail_url = coverImgUrl
      }

      let response: AxiosResponse;
      if (initialData) {
        response = await axios.patch(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/subcategory/${params.subCategoryId}`, data);
      } else {
        response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/subcategory`, data);
      }
      if(response.data === 'duplicate'){
        toast.error("Duplicate Sub Category")
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
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/subcategory`);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="md:gap-8 gap-4 border rounded-lg p-4 shadow-lg bg-background">
            <div className="text-center pb-2">
              <div className="text-left font-bold">Thumbnail Image</div>
            </div>
            <div className="flex space-x-4 justify-between items-center">
              {coverImgUrl ?
                <>
                  <Image alt={'Cover Image'} src={coverImgUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${coverImgUrl}` : coverImgUrl} width={200} height={200} className="w-52 h-fit" priority/>
                  <Button
                    variant={"destructive"}
                    onClick={() => deleteImage()}
                  > 
                    <Trash width={20} height={20}  className="text-background"/>
                  </Button>
                </>
                :
                <Input
                  id={`file`}
                  type="file"
                  accept="image/*"
                  name="file"
                  onChange={(e) =>
                    e.target.files && handleImageChange(e) // Ensure your file upload function can handle image files
                  }
                  disabled={loading}
                  className="border border-gray-300 p-2 rounded-md"
                />
              }
            </div>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 md:gap-8 gap-4 border rounded-lg p-4 shadow-lg bg-background">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Sub Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="singularname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Singular Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Sub Category singular name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Description</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Sub Category description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shown_on_all_drivers_page"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Shown on Drivers Page
                    </FormLabel>
                    <FormDescription>
                      Check this if this is wanted to be shown in Drivers Page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
