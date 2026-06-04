"use client"

import * as z from "zod"
import axios from "axios"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { allfinishing } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { File, Trash } from "lucide-react"
import { uploadFile } from "@/app/(admin)/admin/upload-file"
import Link from "next/link"
import { Heading } from "@/app/(admin)/admin/components/ui/heading"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/(admin)/admin/components/ui/form"
import { Textarea } from "@/app/(admin)/admin/components/ui/textarea"
import { uploadImage } from "@/app/(admin)/admin/upload-image"
import { MAX_SIZE } from "@/app/(admin)/admin/model/model"


const formSchema = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
});

type FinishingFormValues = z.infer<typeof formSchema>

interface FinishingFormProps {
  initialData: allfinishing | null;
};

export const FinishingForm: React.FC<FinishingFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
 
  const [finishingName, setFinishingName] = useState<string>('')
  
  const [finishingImage, setFinishingImage] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<File>();

  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Finishing' : 'Add Finishing';
  const toastMessage = initialData ? 'Finishing updated.' : 'Finishing added.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData ? {
    ...initialData,
  } : {
    name: '',
    url: ''
  }

  useEffect(() => {
  const fetchData = async () => {
    if (initialData && initialData.url) {
      setFinishingImage(initialData.url);
    }
    else{
      setFinishingImage('')
    }
    initialData && initialData.name ? setFinishingName(initialData.name) : setFinishingName('')
  };
  
  fetchData().catch((error) => {
    console.error("Error fetching finishing: ", error);
  });
  }, [params.finishingId, initialData, initialData?.url, initialData?.name]);



  const deleteImage = async () => {
    setFinishingImage('')
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return
    if (file.size > MAX_SIZE) {
      alert("File size must be less than 2MB");
      e.target.value = "";
      return;
    }
    setSelectedImage(file);
  };

  async function handleImageUpload (file: File): Promise<string> {
    if (file) {
      let updatedFinishingImage = finishingImage;
      try {
        const formData = new FormData();
        formData.append('image', file);

        const url = await uploadImage(formData, 'finishing');
        updatedFinishingImage = url
        return updatedFinishingImage;
        } catch (error) {
        console.error("Error uploading finishing Image:", error);
        return '';
      }
    }
    return '';
  };
  


  const form = useForm<FinishingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: FinishingFormValues) => {
    try {
      setLoading(true);

      if (selectedImage) {
        data.url = await handleImageUpload(selectedImage);
      }
      else{
        data.url = finishingImage
      }
      data.name = finishingName;

      const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_UPDATE_ADD_FINISHING}`;
      const API_EDITED = API.replace('{brandId}', typeof params.brandId === 'string' ? params.brandId : '')
      const API_EDITED2 = API_EDITED.replace('{finishingId}', typeof params.finishingId === 'string' ? params.finishingId : '')
      const response = await axios.patch(API_EDITED2, data);
           
      if(response.data === 'duplicate'){
        toast.error("Duplicate Finishing")
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
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/allfinishing`);
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
        <Heading title={title} description='' />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 shadow-lg bg-background">
            <div className="text-left font-bold pb-2">Finishing Image</div>
              <div className="flex space-x-4 justify-between items-center">
                {finishingImage && (
                  <Image alt={'Finishing Image'} src={finishingImage.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finishingImage}` : finishingImage} width={200} height={200} className="w-52 h-fit" priority/>
                )}
                {!finishingImage && (
                <Input
                  id={`file`}
                  type="file"
                  accept="image/*"
                  name="file"
                  onChange={(e) =>
                    e.target.files && handleImageChange(e) // Ensure your file upload function can handle image files
                  }
                  // required
                  disabled={loading}
                  className="border border-gray-300 p-2 rounded-md"
                />
                )}
                {finishingImage && finishingImage !== '' && (
                <Button
                  variant={"destructive"}
                  onClick={() => deleteImage()}
                >
                  <Trash width={20} height={20} />
                </Button>
              )}
              </div>
            </div>


            <div className="border rounded-lg p-4 shadow-lg gap-4 flex items-center w-full bg-background">
              <div className="w-full">
                    <div className="text-left font-bold pb-2">Name</div>
                <div className="flex space-x-4 justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Input
                        type="text"
                        defaultValue={initialData?.name || ''}
                        placeholder="Finishing Name"
                        onChange={(e) => {
                          setFinishingName(e.target.value);
                        }}
                      />
                    </div>
                </div>
              </div>
            </div>
          </div>

          <Button disabled={loading} className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors" type="submit" variant={'secondary'}>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

