"use client"

import * as z from "zod"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { technicals } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { File, FileIcon, Loader2, Trash } from "lucide-react"
import { uploadFile } from "@/app/(admin)/admin/upload-file"
import Link from "next/link"
import { Heading } from "@/app/(admin)/admin/components/ui/heading"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/(admin)/admin/components/ui/form"
import { Textarea } from "@/app/(admin)/admin/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/(admin)/admin/components/ui/select"
import { formatFileSize, MAX_FILE_SIZE } from "@/app/(admin)/admin/lib"


const formSchema = z.object({
  name: z.string().min(1),
  desc: z.string().min(1),
  pdf: z.string().optional(),
  pdfname: z.string().optional(),
  priority: z.string().optional()
});

type TechnicalFormValues = z.infer<typeof formSchema>

interface TechnicalFormProps {
  initialData: technicals | null;
  total: string[]
};

export const TechnicalForm: React.FC<TechnicalFormProps> = ({
  initialData, total
}) => {
  const params = useParams();
  const router = useRouter();
 
  const [technicalPDF, setTechnicalPDF] = useState<string>(initialData?.pdf ?? '')
  const [selectedFile, setSelectedFile] = useState<File>();
  const [filenamePDF, setFilenamePDF] = useState<string>(initialData?.pdfname ?? '')
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const submitInProgress = useRef(false);

  const title = initialData ? 'Edit Technical' : 'Add Technical';
  const toastMessage = initialData ? 'Technical updated.' : 'Technical added.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData ? {
    ...initialData,
  } : {
    name: '',
    desc: '',
    pdf: '',
    pdfname: '',
    priority: ''
  }

  useEffect(() => {
    setTechnicalPDF(initialData?.pdf ?? '');
    setFilenamePDF(initialData?.pdfname ?? '')
    setSelectedFile(undefined)
  }, [initialData?.id, initialData?.pdf, initialData?.pdfname]);

  const deletePDF = async () => {
    setTechnicalPDF('')
    setSelectedFile(undefined);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') || file.type !== 'application/pdf') {
      toast.error('Please choose a PDF file.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`The PDF exceeds the 50 MB per-file limit (${formatFileSize(file.size)}).`);
      e.target.value = '';
      return;
    }
    setSelectedFile(file);
    e.target.value = '';
  };

  async function handlePDFUpload(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const url = await uploadFile(formData, 'technicals');
    if (!url) throw new Error('PDF upload did not return a file URL.');
    return url;
  }


  const form = useForm<TechnicalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: TechnicalFormValues) => {
    if (submitInProgress.current) return;
    submitInProgress.current = true;
    let currentStage = '';
    try {
      setLoading(true);

      let pdf = technicalPDF;
      if (selectedFile) {
        currentStage = 'pdf';
        setUploadStatus('Uploading PDF…');
        pdf = await handlePDFUpload(selectedFile);
      }

      currentStage = 'saving';
      setUploadStatus('Saving catalogue…');

      const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_UPDATE_ADD_TECHNICALS}`;
      const API_EDITED = API.replace('{brandId}', typeof params.brandId === 'string' ? params.brandId : '')
      const API_EDITED2 = API_EDITED.replace('{technicalId}', typeof params.technicalId === 'string' ? params.technicalId : '')
      const response = await axios.patch(API_EDITED2, {
        ...data,
        pdf,
        pdfname: filenamePDF,
      });
           
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
      console.error('Error saving technical:', error);
      toast.error(currentStage === 'image'
        ? 'Could not upload the cover image. Your image was not saved.'
        : currentStage === 'pdf'
          ? 'Could not upload the PDF. Your PDF was not saved.'
          : 'Something went wrong. Your technical was not saved.');
    } finally {
      setLoading(false);
      setUploadStatus('');
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 shadow-lg bg-background">
                <div className="text-left font-bold pb-2">PDF</div>
                <div className="flex space-x-4 justify-between items-center">
                  <div
                    className="flex items-center justify-between rounded-md p-2 shadow-md mb-2 border"
                  >
                    <div className="flex items-center space-x-4">
                      {technicalPDF && technicalPDF !== '' ? (
                        <Link
                          href={technicalPDF}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-medium hover:underline transition-colors whitespace-nowrap flex items-center gap-2"
                        >
                          <FileIcon width={20} height={20}/> View File
                        </Link>
                      ):
                       <Input
                          id="technical-pdf"
                          type="file"
                          accept=".pdf"
                          name="pdf"
                          onChange={(e) =>
                            e.target.files && handleFileChange(e)
                          }
                          disabled={loading}
                          className="w-full"
                        />
                      }
                      {Boolean(technicalPDF) && (
                        <Button
                          type="button"
                          variant={"destructive"}
                          aria-label="Remove PDF"
                          disabled={loading}
                          onClick={() => deletePDF()}
                        >
                          <Trash width={20} height={20} />
                        </Button>
                      )}
                      <Input
                        type="text"
                        value={filenamePDF}
                        placeholder="PDF File name"
                        disabled={loading}
                        className="w-full"
                        onChange={(e) => {
                          setFilenamePDF(e.target.value);
                        }}
                      />
                    </div>
                    
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
                <div className="py-2">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base flex gap-2">
                          Priority
                        </FormLabel>
                        <Select
                          disabled={loading}
                          value={field.value ? field.value.toString() : "none"}
                          onValueChange={(value) => {
                            field.onChange(value === "none" ? "" : value);
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectItem value="none">
                              No priority
                            </SelectItem>

                            {Array.from({ length: total.length + 1 }, (_, index) => index + 1).map(
                              (priority) => {
                                return (
                                  <SelectItem
                                    key={priority}
                                    value={priority.toString()}
                                  >
                                    {priority}
                                  </SelectItem>
                                );
                              }
                            )}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button disabled={loading} className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors" type="submit" variant={'secondary'}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? uploadStatus || 'Saving…' : action}
          </Button>
        </form>
      </Form>
    </>
  );
};
