"use client"

import * as z from "zod"
import axios from "axios"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { catalogues, technicals } from "@prisma/client"
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
  pdfname: z.string().optional(),
  pdf: z.string().optional(),
  cover: z.string().optional()
});

type CatalogueFormValues = z.infer<typeof formSchema>

interface CatalogueFormProps {
  initialData: catalogues | null;
};

export const CatalogueForm: React.FC<CatalogueFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
 
  const [cataloguePDF, setCataloguePDF] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File>();
  const [filenamePDF, setFilenamePDF] = useState<string>('')
  
  const [catalogueImage, setCatalogueImage] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<File>();

  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Catalogue' : 'Add Catalogue';
  const toastMessage = initialData ? 'Catalogue updated.' : 'Catalogue added.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData ? {
    ...initialData,
  } : {
    pdfname: '',
    pdf: '',
    cover: ''
  }

  useEffect(() => {
  const fetchData = async () => {
    if (initialData && initialData.pdf) {
      setCataloguePDF(initialData.pdf);
    }
    else{
      setCataloguePDF('')
    }
    if (initialData && initialData.cover) {
      setCatalogueImage(initialData.cover);
    }
    else{
      setCatalogueImage('')
    }
    initialData && initialData.pdfname ? setFilenamePDF(initialData.pdfname) : setFilenamePDF('')
  };
  
  fetchData().catch((error) => {
    console.error("Error fetching catalogue: ", error);
  });
  }, [params.catalogueId, initialData, initialData?.pdf, initialData?.cover]);

  const deletePDF = async () => {
    setCataloguePDF('')
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file);
  };

  async function handlePDFUpload (file: File): Promise<string> {
    if (file) {
      let updatedCataloguePDF = cataloguePDF;
      try {
        const formData = new FormData();
        formData.append('file', file);

        const url = await uploadFile(formData, 'catalogues');
        updatedCataloguePDF = url
        return updatedCataloguePDF;
        } catch (error) {
        console.error("Error uploading catalogue PDF:", error);
        return '';
      }
    }
    return '';
  };



  const deleteImage = async () => {
    setCatalogueImage('')
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
      let updatedCatalogueImage = catalogueImage;
      try {
        const formData = new FormData();
        formData.append('image', file);

        const url = await uploadImage(formData, 'catalogues');
        updatedCatalogueImage = url
        return updatedCatalogueImage;
        } catch (error) {
        console.error("Error uploading catalogue Image:", error);
        return '';
      }
    }
    return '';
  };
  


  const form = useForm<CatalogueFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: CatalogueFormValues) => {
    try {
      setLoading(true);

      if (selectedFile) {
        data.pdf = await handlePDFUpload(selectedFile);
      }
      else{
        data.pdf = cataloguePDF
      }

      if (selectedImage) {
        data.cover = await handleImageUpload(selectedImage);
      }
      else{
        data.cover = catalogueImage
      }
      data.pdfname = filenamePDF;

      const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_UPDATE_ADD_CATALOGUES}`;
      const API_EDITED = API.replace('{brandId}', typeof params.brandId === 'string' ? params.brandId : '')
      const API_EDITED2 = API_EDITED.replace('{catalogueId}', typeof params.catalogueId === 'string' ? params.catalogueId : '')
      const response = await axios.patch(API_EDITED2, data);
           
      if(response.data === 'duplicate'){
        toast.error("Duplicate Catalogue")
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
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/catalogues`);
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
                {/* <div className="text-left font-bold pb-2">PDF</div>
                <div className="flex space-x-4 justify-between items-center">
                  <div
                    className="flex items-center justify-between rounded-md p-2 shadow-md mb-2 border"
                  >
                    <div className="flex items-center space-x-4">
                      {cataloguePDF && cataloguePDF !== '' && (
                        <Link
                          href={cataloguePDF}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-medium hover:underline transition-colors whitespace-nowrap flex items-center gap-2"
                        >
                          <File width={20} height={20}/> View File
                        </Link>
                      )}
                      {cataloguePDF === '' && (
                        <Input
                          id={`file`}
                          type="file"
                          accept=".pdf"
                          name="file"
                          onChange={(e) =>
                            e.target.files && handleFileChange(e)
                          }
                          disabled={loading}
                          // className="border border-gray-300 p-2 rounded-md"
                        />
                      )}
                      <Input
                        type="text"
                        defaultValue={initialData?.pdfname || ''}
                        placeholder="PDF File name"
                        onChange={(e) => {
                          setFilenamePDF(e.target.value);
                        }}
                        // className="border border-gray-300 p-2 rounded-md w-full"
                      />
                    </div>
                    <Button
                      variant={"destructive"}
                      onClick={() => deletePDF()}
                    >
                      <Trash width={20} height={20} />
                    </Button>
                  </div>
                </div> */}

            <div className="text-left font-bold pb-2">Cover Image</div>
              <div className="flex space-x-4 justify-between items-center">
                {catalogueImage && (
                  <Image alt={'Catalogue Image'} src={catalogueImage.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${catalogueImage}` : catalogueImage} width={200} height={200} className="w-52 h-fit" priority/>
                )}
                {!catalogueImage && (
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
                {catalogueImage && catalogueImage !== '' && (
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
                {/* <div className="py-2">
                  <FormField
                    control={form.control}
                    name="pdfname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base flex gap-2">
                          PDF Name
                        </FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="PDF Name" {...field}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */}
                    <div className="text-left font-bold pb-2">PDF</div>
                <div className="flex space-x-4 justify-between items-center">
                  {/* <div
                    className="flex items-center justify-between rounded-md p-2 shadow-md mb-2 border"
                  > */}
                    <div className="flex items-center space-x-4">
                      {cataloguePDF && cataloguePDF !== '' && (
                        <Link
                          href={cataloguePDF}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-medium hover:underline transition-colors whitespace-nowrap flex items-center gap-2"
                        >
                          <File width={20} height={20}/> View File
                        </Link>
                      )}
                      {cataloguePDF === '' && (
                        <Input
                          id={`file`}
                          type="file"
                          accept=".pdf"
                          name="file"
                          onChange={(e) =>
                            e.target.files && handleFileChange(e)
                          }
                          disabled={loading}
                          // className="border border-gray-300 p-2 rounded-md"
                        />
                      )}
                      <Input
                        type="text"
                        defaultValue={initialData?.pdfname || ''}
                        placeholder="PDF File name"
                        onChange={(e) => {
                          setFilenamePDF(e.target.value);
                        }}
                        // className="border border-gray-300 p-2 rounded-md w-full"
                      />
                    </div>
                    <Button
                      variant={"destructive"}
                      onClick={() => deletePDF()}
                    >
                      <Trash width={20} height={20} />
                    </Button>
                  {/* </div> */}
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

