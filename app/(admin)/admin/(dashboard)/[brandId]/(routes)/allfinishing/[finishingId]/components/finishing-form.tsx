"use client"

import * as z from "zod"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
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
import { Heading } from "@/app/(admin)/admin/components/ui/heading"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/(admin)/admin/components/ui/form"
import { uploadImage } from "@/app/(admin)/admin/upload-image"
import { formatFileSize, MAX_FILE_SIZE } from "@/app/(admin)/admin/lib"


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
  const submitInProgress = useRef(false);

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
    setFinishingImage(initialData?.url ?? '');
    setSelectedImage(undefined);
    setFinishingName(initialData?.name ?? '');
  }, [params.finishingId, initialData?.id, initialData?.url, initialData?.name]);

  const deleteImage = async () => {
    setFinishingImage('')
  };

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
    setSelectedImage(file);
    e.target.value = '';
  };

  async function handleImageUpload(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    const url = await uploadImage(formData, 'finishing');
    if (!url) throw new Error('Image upload did not return a file URL.');
    return url;
  }
  


  const form = useForm<FinishingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: FinishingFormValues) => {
    if (submitInProgress.current) return;
    submitInProgress.current = true;
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
      submitInProgress.current = false;
    }
  };


  return (  
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description='' />
      </div>
      <Separator />
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
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
          }}
          className="space-y-4 w-full"
          >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 shadow-lg bg-background">
            <div className="text-left font-bold pb-2">Finishing Image</div>
              <div className="flex space-x-4 justify-between items-center">
                {finishingImage ? (
                  <div className="flex items-center gap-4">
                    <Image alt={'Finishing Image'} src={finishingImage.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finishingImage}` : finishingImage} width={200} height={200} className="w-52 h-fit" priority/>
                    <Button
                      variant={"destructive"}
                      aria-label="Remove image"
                      disabled={loading}
                      onClick={() => deleteImage()}
                    >
                      <Trash width={20} height={20} />
                    </Button>
                  </div>
                ) :
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
                }
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

