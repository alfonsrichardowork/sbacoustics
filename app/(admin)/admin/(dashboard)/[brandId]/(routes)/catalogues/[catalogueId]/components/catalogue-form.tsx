"use client"

import * as z from "zod"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { catalogues } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { File as FileIcon, Loader2, Trash, X } from "lucide-react"
import { uploadFile } from "@/app/(admin)/admin/upload-file"
import Link from "next/link"
import { Heading } from "@/app/(admin)/admin/components/ui/heading"
import { Form } from "@/app/(admin)/admin/components/ui/form"
import { uploadImage } from "@/app/(admin)/admin/upload-image"

const MAX_FILE_SIZE = 50 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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
 
  const [cataloguePDF, setCataloguePDF] = useState<string>(initialData?.pdf ?? '')
  const [selectedFile, setSelectedFile] = useState<File>();
  const [filenamePDF, setFilenamePDF] = useState<string>(initialData?.pdfname ?? '')
  
  const [catalogueImage, setCatalogueImage] = useState<string>(initialData?.cover ?? '')
  const [selectedImage, setSelectedImage] = useState<File>();

  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const submitInProgress = useRef(false);

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
    setCataloguePDF(initialData?.pdf ?? '');
    setCatalogueImage(initialData?.cover ?? '');
    setFilenamePDF(initialData?.pdfname ?? '');
    setSelectedFile(undefined);
    setSelectedImage(undefined);
  }, [initialData?.id, initialData?.pdf, initialData?.cover, initialData?.pdfname]);

  const deletePDF = () => {
    setCataloguePDF('');
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
    const url = await uploadFile(formData, 'catalogues');
    if (!url) throw new Error('PDF upload did not return a file URL.');
    return url;
  }

  const deleteImage = () => {
    setCatalogueImage('');
    setSelectedImage(undefined);
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
    const url = await uploadImage(formData, 'catalogues');
    if (!url) throw new Error('Image upload did not return a file URL.');
    return url;
  }
  


  const form = useForm<CatalogueFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const totalSelectedFileSize = (selectedFile?.size ?? 0) + (selectedImage?.size ?? 0);

  const onSubmit = async (data: CatalogueFormValues) => {
    if (submitInProgress.current) return;
    submitInProgress.current = true;
    let currentStage = '';
    try {
      setLoading(true);

      let pdf = cataloguePDF;
      if (selectedFile) {
        currentStage = 'pdf';
        setUploadStatus('Uploading PDF…');
        pdf = await handlePDFUpload(selectedFile);
      }

      let cover = catalogueImage;
      if (selectedImage) {
        currentStage = 'image';
        setUploadStatus('Uploading cover image…');
        cover = await handleImageUpload(selectedImage);
      }

      currentStage = 'saving';
      setUploadStatus('Saving catalogue…');

      const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_UPDATE_ADD_CATALOGUES}`;
      const API_EDITED = API.replace('{brandId}', typeof params.brandId === 'string' ? params.brandId : '')
      const API_EDITED2 = API_EDITED.replace('{catalogueId}', typeof params.catalogueId === 'string' ? params.catalogueId : '')
      const response = await axios.patch(API_EDITED2, {
        ...data,
        pdf,
        cover,
        pdfname: filenamePDF,
      });
           
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
    } catch (error) {
      console.error('Error saving catalogue:', error);
      toast.error(currentStage === 'image'
        ? 'Could not upload the cover image. Your catalogue was not saved.'
        : currentStage === 'pdf'
          ? 'Could not upload the PDF. Your catalogue was not saved.'
          : 'Something went wrong. Your catalogue was not saved.');
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
              <div className="flex flex-col gap-4">
                {catalogueImage ? (
                  <div className="flex items-center gap-4">
                    <Image alt={'Catalogue Image'} src={catalogueImage.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${catalogueImage}` : catalogueImage} width={200} height={200} className="w-52 h-fit" priority/>

                    <Button
                      type="button"
                      variant={"destructive"}
                      aria-label="Remove cover image"
                      disabled={loading}
                      onClick={() => deleteImage()}
                    >
                      <Trash width={20} height={20} />
                    </Button>
                  </div>
                ) :
                  <Input
                    id="catalogue-cover"
                    type="file"
                    accept="image/*"
                    name="cover"
                    onChange={(e) =>
                      e.target.files && handleImageChange(e)
                    }
                    disabled={loading}
                    className="border border-gray-300 p-2 rounded-md"
                  />
                }
                {selectedImage && (
                  <div className="flex items-center gap-2 text-sm" role="status">
                    <span>Selected: {selectedImage.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove selected cover image"
                      disabled={loading}
                      onClick={() => setSelectedImage(undefined)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
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
                <div className="flex w-full flex-col items-start gap-3">
                  {/* <div
                    className="flex items-center justify-between rounded-md p-2 shadow-md mb-2 border"
                  > */}
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                      {cataloguePDF && cataloguePDF !== '' ? (
                        <Link
                          href={cataloguePDF}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-medium hover:underline transition-colors whitespace-nowrap flex items-center gap-2"
                        >
                          <FileIcon width={20} height={20}/> View File
                        </Link>
                      ):
                        <Input
                          id="catalogue-pdf"
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
                      {Boolean(cataloguePDF) && (
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
                        // className="border border-gray-300 p-2 rounded-md w-full"
                      />
                    </div>
                    {selectedFile && (
                      <div className="flex items-center gap-2 text-sm" role="status">
                        <span>Selected: {selectedFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Remove selected PDF"
                          disabled={loading}
                          onClick={() => setSelectedFile(undefined)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
            Selected upload size: {formatFileSize(totalSelectedFileSize)} total
            <span className="ml-1">(50 MB maximum per file)</span>
          </p>
          <Button disabled={loading} className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors" type="submit" variant={'secondary'}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? uploadStatus || 'Saving…' : action}
          </Button>
        </form>
      </Form>
    </>
  );
};
