"use client"

import * as z from "zod"
import axios, { AxiosResponse } from "axios"
import { useEffect, useRef, useState } from "react"
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
import { Heading } from "@/app/(admin)/admin/components/ui/heading"
import { Separator } from "@/app/(admin)/admin/components/ui/separator"
import { uploadImage } from "@/app/(admin)/admin/upload-image"
import Image from "next/image"
import { Checkbox } from "@/app/(admin)/admin/components/ui/checkbox"
import { formatFileSize, MAX_FILE_SIZE } from "@/app/(admin)/admin/lib"

const formSchema = z.object({
  name: z.string().min(1),
  singularname: z.string().min(1),
  description: z.string().min(1),
  type: z.string().min(1),
  thumbnail_url: z.string().optional(),
  shown_on_all_drivers_page: z.boolean().default(false).optional(),
});

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
  initialData: allcategory | null;
};

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [coverImgUrl, setCoverImgUrl] = useState<string>();
  const [coverImg, setCoverImg] = useState<File>();
  const [loading, setLoading] = useState(false);
  const submitInProgress = useRef(false);

  const title = initialData ? 'Edit category' : 'Create category';
  const description = initialData ? 'Edit a category.' : 'Add a new category';
  const toastMessage = initialData ? 'Category updated.' : 'Category created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      singularname: '',
      description: '',
      type: 'Category',
      thumbnail_url: '',
      shown_on_all_drivers_page: false,
    }
  });

  useEffect(() => {
    setCoverImgUrl(initialData?.thumbnail_url ?? '')
  }, [initialData?.id, initialData?.thumbnail_url]);
  
    //THUMBNAIL IMAGE
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(!file) return
      if (!file.type.startsWith('image/')) {
        toast.error('Please choose an image file.');
        e.target.value = '';
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`The cover image exceeds the 50 MB per-file limit (${formatFileSize(file.size)}).`);
        e.target.value = "";
        return;
      }
      setCoverImg(file);
      e.target.value = '';
    };
  
    const deleteImage = async () => {
      setCoverImgUrl('')
      setCoverImg(undefined)
    }
  


  async function handleCoverImageUpload(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    const url = await uploadImage(formData, 'other');
    if (!url) throw new Error('Image upload did not return a file URL.');
    return url;
  }  

  const onSubmit = async (data: CategoryFormValues) => {
    if (submitInProgress.current) return;
    submitInProgress.current = true;
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
        response = await axios.patch(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/category/${params.categoryId}`, data);
      } else {
        response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/category`, data);
      }
      if(response.data === 'duplicate'){
        toast.error("Duplicate Category")
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
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/category`);
        router.refresh();
        toast.success(toastMessage);
      }
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      submitInProgress.current = false;
    }
  };

  return (
    <>
     <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={(event) => {
            const target = event.target;
            if (
              event.key === "Enter" &&
              !event.nativeEvent.isComposing &&
              target instanceof HTMLInputElement &&
              !target.hasAttribute("cmdk-input") &&
              !["button", "checkbox", "file", "image", "radio", "reset", "submit"].includes(target.type)
            ) {
              event.preventDefault();
            }
          }} className="space-y-4 w-full">
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
                    <Input disabled={loading} placeholder="Category name" {...field} />
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
                    <Input disabled={loading} placeholder="Category singular name" {...field} />
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
                    <Input disabled={loading} placeholder="Category description" {...field} />
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
