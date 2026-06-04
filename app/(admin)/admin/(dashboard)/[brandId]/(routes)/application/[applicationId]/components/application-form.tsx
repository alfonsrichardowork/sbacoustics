"use client"

import * as z from "zod"
import axios, { AxiosResponse } from "axios"
import { useCallback, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { image_catalogues, multipledatasheetproduct, sbaudienceapplication } from "@prisma/client"
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
import { Textarea } from "@/app/(admin)/admin/components/ui/textarea"
import Link from "next/link"
import Image from "next/image"
import { Bold, CirclePlus, File, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Italic, List, ListOrdered, LucideLink, LucideUnlink, Strikethrough, Trash } from "lucide-react"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import HeadingTiptap from '@tiptap/extension-heading';
import ImageTiptap from '@tiptap/extension-image';
import LinkTiptap from '@tiptap/extension-link'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Text from '@tiptap/extension-text'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
//@ts-ignore
import '@/app/css/styles.scss'
import { Toggle } from "@/app/(admin)/admin/components/ui/toggle"
import { uploadImage } from "@/app/(admin)/admin/upload-image"
import { uploadFile } from "@/app/(admin)/admin/upload-file"
import { MAX_SIZE } from "@/app/(admin)/admin/model/model"

const formSchema = z.object({
  name: z.string().min(1),
  author: z.string().optional(),
  images_catalogues: z.object({ url: z.string() }).array(),
  cover_img_url: z.string().optional(),
  datasheet: z.object({ url: z.string() }).array(),
  description: z.string().min(1),
});

type ApplicationFormValues = z.infer<typeof formSchema>

interface ApplicationFormProps {
  initialData: sbaudienceapplication & {
    images_catalogues: image_catalogues[]
    datasheet: multipledatasheetproduct[]
  } | null;
};

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [allDatasheet, setAllDatasheet] = useState<multipledatasheetproduct[]>([]);
  const [selectedDatasheetFile, setSelectedDatasheetFile] = useState<File[]>([]);

  const [coverImgUrl, setCoverImgUrl] = useState<string>('');
  const [coverImg, setCoverImg] = useState<File>();
  
  const [imgCataloguesUrl, setImgCataloguesUrl] = useState<image_catalogues[]>([]);
  const [imgCatalogues, setImgCatalogues] = useState<File[]>([]);


  const title = initialData ? 'Edit Application' : 'Create Application';
  const description = initialData ? `For ${initialData.name}` : 'Add a new Application';
  const toastMessage = initialData ? 'Application updated.' : 'Application created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData ? {
    ...initialData,
  } : {
    name: '',
    author: '',
    images_catalogues: [],
    cover_img_url: '',
    datasheet: [],
    description: '',
  }


  useEffect(() => {
    const fetchData = async () => {
      if (initialData && initialData.datasheet) {
        setAllDatasheet(initialData.datasheet);
      }
      
      if (initialData && initialData.cover_img_url) {
        setCoverImgUrl(initialData.cover_img_url);
      }
      else{
        setCoverImgUrl('')
      }
      
      if (initialData && initialData.images_catalogues) {
        setImgCataloguesUrl(initialData.images_catalogues);
      }
    };
  
    fetchData().catch((error) => {
      console.error("Error fetching data: ", error);
    });
  
  }, [params.applicationId, initialData, initialData?.datasheet, initialData?.cover_img_url, initialData?.images_catalogues]); 


  //MULTIPLE DATASHEET
  const addDatasheetCounter = () => {
    setAllDatasheet((prev) => [
      ...prev,
      {
        id: Math.random().toString(), // Using a random id for uniqueness
        applicationId: params.applicationId?.toString() ?? '',
        productId: '',
        url: "",
        name: "",
      },
    ]);
  };

  const reduceDatasheetCounter = (index: number) => {
    setAllDatasheet((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDatasheetFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const tempfile = e.target.files?.[0];
    let temp = selectedDatasheetFile
    temp[index] = tempfile!
    setSelectedDatasheetFile(temp);
  };

  async function handleDatasheetFileUpload(file: File[]): Promise<multipledatasheetproduct[]> {
    if (file && file.length > 0) {
      let updatedDatasheet = [...allDatasheet];
      try {
        const uploadPromises = file.map(async (value, index) => {
          if (value) {
            const formData = new FormData();
            formData.append('file', value);
            const url = await uploadFile(formData, 'applicationdatasheet');
            const elementIndex = updatedDatasheet.length - (file.length - index);
            if (updatedDatasheet[elementIndex]) {
              updatedDatasheet[elementIndex].url = url;
            }
          }
        });

        await Promise.all(uploadPromises);
        return updatedDatasheet;
      } catch (error) {
        console.error("Error uploading files:", error);
        return [];
      }
    }  
    return [];
  }


  //COVER IMAGE
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return
    if (file.size > MAX_SIZE) {
      alert("File size must be less than 2MB");
      e.target.value = "";
      return;
    }
    setCoverImg(file);
  };

  const deleteCoverImage = async () => {
    setCoverImgUrl('')
  }

  async function handleCoverImageUpload(file: File): Promise<string> {
    if (file) {
      let updatedCoverImage = coverImgUrl
      try {
        const formData = new FormData();
        formData.append('image', file);
  
        const url = await uploadImage(formData, 'applicationimage');
        updatedCoverImage = url;
        return updatedCoverImage;
      } catch (error) {
        console.error("Error uploading cover image:", error);
        return '';
      }
    }
    return '';
  }

  //MULTIPLE IMAGE CATALOGUES
  const addImageCataloguesCounter = () => {
    setImgCataloguesUrl((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        productId: '',
        applicationId: params.applicationId?.toString() ?? '',
        url: "",
        name: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  };

  const reduceImageCataloguesCounter = (index: number) => {
    setImgCataloguesUrl((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageCataloguesFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const tempfile = e.target.files?.[0];
    if(!tempfile) return
    if (tempfile.size > MAX_SIZE) {
      alert("File size must be less than 2MB");
      e.target.value = "";
      return;
    }
    let temp = imgCatalogues
    temp[index] = tempfile!
    setImgCatalogues(temp);
  };

  async function handleImageCataloguesFileUpload(file: File[]): Promise<image_catalogues[]> {
    if (file && file.length > 0) {
      let updatedImageCatalogues = [...imgCataloguesUrl];
      try {
        const uploadPromises = file.map(async (value, index) => {
          if (value) {
            const formData = new FormData();
            formData.append('image', value);
            const url = await uploadImage(formData, 'applicationimage');  
            const elementIndex = updatedImageCatalogues.length - (file.length - index);
            if (updatedImageCatalogues[elementIndex]) {
              updatedImageCatalogues[elementIndex].url = url;
            }
          }
        });

        await Promise.all(uploadPromises);
        return updatedImageCatalogues;
      } catch (error) {
        console.error("Error uploading image catalogues:", error);
        return [];
      }
    }  
    return [];
  }


  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ApplicationFormValues) => {
    try {
      setLoading(true);
        
      if (selectedDatasheetFile && selectedDatasheetFile.length > 0) {
        data.datasheet = await handleDatasheetFileUpload(selectedDatasheetFile)
      }
      else{
        data.datasheet = allDatasheet
      }

      if (coverImg) {
        data.cover_img_url = await handleCoverImageUpload(coverImg)
      }
      else{
        data.cover_img_url = coverImgUrl
      }


      if (imgCatalogues && imgCatalogues.length > 0) {
        data.images_catalogues = await handleImageCataloguesFileUpload(imgCatalogues)
      }
      else{
        data.images_catalogues = imgCataloguesUrl
      }
      data.description = editor && editor.getHTML() ? editor.getHTML() : ''

      let response: AxiosResponse;
      if (initialData) {
        response = await axios.patch(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/application/${params.applicationId}`, data);
      } else {
        response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/application`, data);
      }
      if(response.data === 'duplicate'){
        toast.error("Duplicate Application")
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
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/application`);
        router.refresh();
        toast.success(toastMessage);
      }
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };






  const cleanHTML = initialData?.description
    ?.replace(/<pre><code>/gi, '<p>')
    ?.replace(/<\/code><\/pre>/gi, '</p>')
    ?.replace(/<pre>/gi, '<p>')
    ?.replace(/<\/pre>/gi, '</p>')
    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit,
        HeadingTiptap.configure({
          levels: [1, 2, 3, 4, 5, 6],
        }),
        ImageTiptap,
        BulletList,
        OrderedList,
        LinkTiptap.configure({
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
          protocols: ['http', 'https'],
          isAllowedUri: (url: string, ctx:any) => {
            try {
              // construct URL
              const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)
  
              // use default validation
              if (!ctx.defaultValidate(parsedUrl.href)) {
                return false
              }
  
              // disallowed protocols
              const disallowedProtocols = ['ftp', 'file', 'mailto']
              const protocol = parsedUrl.protocol.replace(':', '')
  
              if (disallowedProtocols.includes(protocol)) {
                return false
              }
  
              // only allow protocols specified in ctx.protocols
              const allowedProtocols = ctx.protocols.map((p: string | { scheme: string }) => (typeof p === 'string' ? p : p.scheme))
  
              if (!allowedProtocols.includes(protocol)) {
                return false
              }
  
              // disallowed domains
              const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
              const domain = parsedUrl.hostname
  
              if (disallowedDomains.includes(domain)) {
                return false
              }
  
              // all checks have passed
              return true
            } catch (error) {
              return false
            }
          },
          shouldAutoLink: url => {
            try {
              // construct URL
              const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)
  
              // only auto-link if the domain is not in the disallowed list
              const disallowedDomains = ['']
              const domain = parsedUrl.hostname
  
              return !disallowedDomains.includes(domain)
            } catch (error) {
              return false
            }
          },
  
        }),
        Text,
        TextStyle,
        Color,
      ],
      editorProps: {
        attributes: {
          class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-hidden',
        },
      },
      content: cleanHTML ? cleanHTML : '<p></p>',
    });
  
    
  
    const setLink = useCallback(() => {
      const previousUrl = editor!.getAttributes('link').href
      const url = window.prompt('Change the root URL to {temp}. Ex: https://sbacoustics.com/sbaudience/products/sb12pac25-4 => {temp}products/sb12pac25-4', previousUrl)
  
      // cancelled
      if (url === null) {
        return
      }
  
      // empty
      if (url === '') {
        editor!.chain().focus().extendMarkRange('link').unsetLink()
          .run()
  
        return
      }
  
      // update link
      editor!.chain().focus().extendMarkRange('link').setLink({ href: url })
        .run()
    }, [editor])
  
    if (!editor) {
      return null
    }

  
  return (  
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("validation errors:", errors);
        })} className="space-y-4 w-full">
          
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="border rounded-lg p-4 shadow-lg bg-background">
            <div className="text-center mb-6">
              <div className="text-left font-bold text-base">Cover Image</div>
            </div>
            <div className="space-y-2 rounded-lg border shadow-md p-2">
                <div
                  className="flex items-center justify-between rounded-md shadow-xs"
                >
                  {coverImgUrl !== '' ?
                  <>
                  <div className="flex items-center space-x-4">
                    <Image
                      src={coverImgUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${coverImgUrl}` : coverImgUrl}
                      alt={initialData?.name? initialData?.name : ''}
                      width={100}
                      height={100}
                      className="w-32 h-fit"
                      priority
                    />
                  </div>
                  <Button
                  variant={"destructive"}
                  onClick={() => deleteCoverImage()}
                >
                  <Trash width={20} height={20} />
                </Button>
                </>
                :
                    <Input
                      type="file"
                      accept="image/*"
                      name="file"
                      onChange={(e) =>
                        e.target.files && handleCoverImageChange(e)
                      }
                      disabled={loading}
                      className="border border-gray-300 p-2 rounded-md"
                      required
                    />
                    }
                </div>
            </div>
          </div>


          <div className="gap-4 border rounded-lg p-4 shadow-lg bg-background">
            <div className="pb-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-base">Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Application name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="pb-2">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-base">Author</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Author" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-base">Description | <Link href={'/images/admin/description_placement.png'} target="blank" className="text-primary hover:underline font-normal text-sm  ">See where this will be shown</Link></FormLabel>
                    <FormDescription>For lists only. Give a new space (enter) for each list. If empty, type <strong>-</strong></FormDescription>
                    <FormControl>
                      <Textarea disabled={loading} placeholder="Application description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}
          </div>

        </div>


    <div className={`border rounded-lg p-4 shadow-lg bg-background`}>
            <div className="font-bold text-base pb-2">Description</div>
              {/* Toolbar */}
              <div>
              <div className="flex gap-2 mb-4 flex-wrap">
                <Toggle
                  pressed={editor.isActive('bold')}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  <Bold className="w-4 h-4" />
                </Toggle>
                <Toggle
                  pressed={editor.isActive('italic')}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  <Italic className="w-4 h-4" />
                </Toggle>
                <Toggle
                  pressed={editor.isActive('strike')}
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                  <Strikethrough className="w-4 h-4" />
                </Toggle>
                <Toggle
                  pressed={editor.isActive('bulletList')}
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                  <List className="w-4 h-4" />
                </Toggle>
                <Toggle
                  pressed={editor.isActive('orderedList')}
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                  <ListOrdered className="w-4 h-4" />
                </Toggle>
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <Toggle
                    key={level}
                    pressed={editor.isActive('heading', { level })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()}
                  >
                    {level === 1 && <Heading1 className="w-4 h-4" />}
                    {level === 2 && <Heading2 className="w-4 h-4" />}
                    {level === 3 && <Heading3 className="w-4 h-4" />}
                    {level === 4 && <Heading4 className="w-4 h-4" />}
                    {level === 5 && <Heading5 className="w-4 h-4" />}
                    {level === 6 && <Heading6 className="w-4 h-4" />}
                  </Toggle>
                ))}
                 
                 <Toggle
                  pressed={editor.isActive('link')}
                  onClick={setLink}
                >
                    <LucideLink className="w-4 h-4" />
                </Toggle>
                <Toggle
                  pressed={!editor.isActive('link')}
                  onClick={() => editor.chain().focus().unsetLink().run()}
                >
                    <LucideUnlink className="w-4 h-4" />
                </Toggle>
                <Toggle
                  onClick={() => editor.chain().focus().setColor('#e60013').run()}
                  pressed={false}
                  // className={editor.isActive('textStyle', { color: '#ed3237' }) ? 'is-active' : ''}
                >
                  <p className="text-primary">Red</p>
                </Toggle>
                <Toggle
                  onClick={() => editor.chain().focus().unsetColor().run()}
                  pressed={false}
                >
                  Black
                </Toggle>
              </div>
                
                {/* <Input  
                  id={`file`}
                  type="file"
                  accept="image/*"
                  name="file"
                  onChange={(e) =>
                    e.target.files && handleFileChangeTiptap(e)
                  }
                  className="border border-gray-300 p-2 rounded-md"
                /> */}

              <EditorContent editor={editor} className="border p-4"/>
              </div>
            </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 shadow-lg bg-background">
            <div className="text-center pb-2 flex justify-between items-center">
              <div className="text-left font-bold text-base">Image Catalogues</div>
              <div
                onClick={addImageCataloguesCounter}
                className="flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors p-2 rounded-lg hover:cursor-pointer"
              >
                <CirclePlus width={20} height={20} />Add Image Catalogues
              </div>
            </div>
              {imgCataloguesUrl && imgCataloguesUrl.length > 0 && imgCataloguesUrl.map((value, index) => (
                
            <div className="space-y-2 rounded-lg border shadow-md p-2" key={index}>
                <div
                  key={value.id}
                  className="flex items-center justify-between rounded-md shadow-xs"
                >
                  <div className="flex items-center space-x-4">
                    {value.url !== '' && (
                      <Image
                      src={value.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${value.url}` : value.url}
                      alt={initialData?.name? initialData?.name : ''}
                      width={100}
                      height={100}
                        className="w-32 h-fit"
                      />
                    )}
                    {value.url === '' && (
                      <Input
                        id={`image-catalogues-${index}`}
                        type="file"
                        accept="image/*"
                        name="file"
                        onChange={(e) =>
                          e.target.files && handleImageCataloguesFileChange(e, index)
                        }
                        disabled={loading}
                        className="border border-gray-300 p-2 rounded-md"
                      />
                    )}
                    <Input
                      type="text"
                      defaultValue={value.name}
                      placeholder="Input this image name"
                      onChange={(e) => {
                        const updatedImageCatalogues = [...imgCataloguesUrl];
                        if (updatedImageCatalogues[index]) {
                          updatedImageCatalogues[index].name = e.target.value;
                        }
                        setImgCataloguesUrl(updatedImageCatalogues);
                      }}
                      required
                      className="border border-gray-300 p-2 rounded-md w-48"
                    />
                  </div>
                  <Button
                    variant={"destructive"}
                    onClick={() => reduceImageCataloguesCounter(index)}
                  >
                    <Trash width={20} height={20} />
                  </Button>
                </div>      
              </div>
              ))
            }
          </div>


          <div className="border rounded-lg p-4 shadow-lg bg-background">
            <div className="text-center pb-2 flex justify-between items-center">
              <div className="text-left font-bold text-base">Datasheet</div>
              <div
                onClick={addDatasheetCounter}
                className="flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors p-2 rounded-lg hover:cursor-pointer"
              >
                <CirclePlus width={20} height={20} />Add Datasheet
              </div>
            </div>
            <div className="space-y-2 rounded-lg border shadow-md p-2">
              {allDatasheet.map((value, index) => (
                <div
                  key={value.id}
                  className="flex items-center justify-between rounded-md shadow-xs py-2"
                >
                  <div className="flex items-center space-x-4">
                    {value.url !== '' && (
                      <Link
                        target="_blank"
                        href={value.url}
                        rel="noopener noreferrer"
                        className="text-primary font-medium hover:underline transition-colors whitespace-nowrap flex items-center gap-2"
                      >
                       <File width={20} height={20}/>  View File
                      </Link>
                    )}
                    {value.url === '' && (
                      <Input
                        id={`file-${index}`}
                        type="file"
                        accept=".pdf"
                        name="file"
                        onChange={(e) =>
                          e.target.files && handleDatasheetFileChange(e, index)
                        }
                        disabled={loading}
                        className="border border-gray-300 p-2 rounded-md"
                      />
                    )}
                    <Input
                      type="text"
                      defaultValue={value.name}
                      placeholder="PDF File name"
                      onChange={(e) => {
                        const updatedDatasheet = [...allDatasheet];
                        if(updatedDatasheet[index]){
                          updatedDatasheet[index].name = e.target.value;
                        }
                        setAllDatasheet(updatedDatasheet);
                      }}
                      required
                      className="border border-gray-300 p-2 rounded-md w-48"
                    />
                  </div>
                  <Button
                    variant={"destructive"}
                    onClick={() => reduceDatasheetCounter(index)}
                  >
                    <Trash width={20} height={20} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

          <Button disabled={loading} type="submit" className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
