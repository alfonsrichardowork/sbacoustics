"use client"

import * as z from "zod"
import axios from "axios"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { technicals } from "@prisma/client"
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


const formSchema = z.object({
  name: z.string().min(1),
  desc: z.string().min(1),
  pdf: z.string().optional(),
  pdfname: z.string().optional()
});

type TechnicalFormValues = z.infer<typeof formSchema>

interface TechnicalFormProps {
  initialData: technicals | null;
};

export const TechnicalForm: React.FC<TechnicalFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
 
  const [technicalPDF, setTechnicalPDF] = useState<string>()
  const [selectedFile, setSelectedFile] = useState<File>();
  const [filenamePDF, setFilenamePDF] = useState<string>('')
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Technical' : 'Add Technical';
  const toastMessage = initialData ? 'Technical updated.' : 'Technical added.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData ? {
    ...initialData,
  } : {
    name: '',
    desc: '',
    pdf: '',
    pdfname: ''
  }

  useEffect(() => {
  const fetchData = async () => {
    if (initialData && initialData.pdf) {
      setTechnicalPDF(initialData.pdf);
    }
    else{
      setTechnicalPDF('')
    }
    initialData && initialData.pdfname ? setFilenamePDF(initialData.pdfname) : setFilenamePDF('')
  };
  
  fetchData().catch((error) => {
    console.error("Error fetching technical: ", error);
  });
  }, [params.technicalId, initialData, initialData?.pdf]);

  const deletePDF = async () => {
    setTechnicalPDF('')
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file);
  };

  async function handlePDFUpload (file: File): Promise<string> {
    if (file) {
      let updatedtechnicalPDF = technicalPDF;
      try {
        const formData = new FormData();
        formData.append('file', file);

        const url = await uploadFile(formData, 'technicals');
        updatedtechnicalPDF = url
        return updatedtechnicalPDF;
        } catch (error) {
        console.error("Error uploading technical PDF:", error);
        return '';
      }
    }
    return '';
  };


  const form = useForm<TechnicalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: TechnicalFormValues) => {
    try {
      setLoading(true);

      if (selectedFile) {
        data.pdf = await handlePDFUpload(selectedFile);
      }
      else{
        data.pdf = technicalPDF
      }
      data.pdfname = filenamePDF;

      const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_UPDATE_ADD_TECHNICALS}`;
      const API_EDITED = API.replace('{brandId}', typeof params.brandId === 'string' ? params.brandId : '')
      const API_EDITED2 = API_EDITED.replace('{technicalId}', typeof params.technicalId === 'string' ? params.technicalId : '')
      const response = await axios.patch(API_EDITED2, data);
           
      if(response.data === 'duplicate'){
        toast.error("Duplicate Technical")
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
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/technicals`);
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
                <div className="text-left font-bold pb-2">PDF</div>
                <div className="flex space-x-4 justify-between items-center">
                  <div
                    className="flex items-center justify-between rounded-md p-2 shadow-md mb-2 border"
                  >
                    <div className="flex items-center space-x-4">
                      {technicalPDF && technicalPDF !== '' && (
                        <Link
                          href={technicalPDF}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-medium hover:underline transition-colors whitespace-nowrap flex items-center gap-2"
                        >
                          <File width={20} height={20}/> View File
                        </Link>
                      )}
                      {technicalPDF === '' && (
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
                </div>
            </div>


            <div className="border rounded-lg p-4 shadow-lg gap-4 flex items-center w-full bg-background">
              <div className="w-full">
                <div className="py-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base flex gap-2">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="Technical Name" {...field}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="py-2">
                  <FormField
                    control={form.control}
                    name="desc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base flex gap-2">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea disabled={loading} placeholder="Description" {...field}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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

