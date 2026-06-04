"use client"

import * as z from "zod"
import axios, { AxiosResponse } from "axios"
import { useCallback, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { image_catalogues, multiple3dmodels, multipledatasheetproduct, multiplefrdzmafiles, product, size } from "@prisma/client"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/(admin)/admin/components/ui/select"
import { Checkbox } from "@/app/(admin)/admin/components/ui/checkbox"
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
  images_catalogues: z.object({ url: z.string() }).array(),
  cover_img_url: z.string().optional(),
  drawing_img_url: z.string().optional(),
  graph_img_url: z.string().optional(),
  multipleDatasheetProduct: z.object({ url: z.string() }).array(),
  multipleFRDZMAFiles: z.object({ url: z.string() }).array(),
  multiple3DModels: z.object({ url: z.string() }).array(),
  description: z.string().optional(),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  isKits: z.boolean().default(false).optional(),
  isNewProduct: z.boolean().default(false).optional(),
  navbarNotes: z.string().optional(),
  searchbox_desc: z.string().optional(),
  tempAllFinished: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  initialData: product & {
    images_catalogues: image_catalogues[]
    multipleDatasheetProduct: multipledatasheetproduct[]
    multipleFRDZMAFiles: multiplefrdzmafiles[]
    multiple3DModels: multiple3dmodels[]
  } | null;
  // datasheet_local: kitsFinishing[]
  sizes: size[];
};

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  // datasheet_local,
  sizes,
}) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [allDatasheet, setAllDatasheet] = useState<multipledatasheetproduct[]>([]);
  const [selectedDatasheetFile, setSelectedDatasheetFile] = useState<File[]>([]);

  const [allFRDZMA, setAllFRDZMA] = useState<multiplefrdzmafiles[]>([]);
  const [selectedFRDZMAFile, setSelectedFRDZMAFile] = useState<File[]>([]);
  
  const [all3DModel, setAll3DModel] = useState<multiple3dmodels[]>([]);
  const [selected3DModel, setSelected3DModel] = useState<File[]>([]);

  const [coverImgUrl, setCoverImgUrl] = useState<string>('');
  const [coverImg, setCoverImg] = useState<File>();

  const [drawingImgUrl, setDrawingImgUrl] = useState<string>('');
  const [drawingImg, setDrawingImg] = useState<File>();
  
  const [freqResponseUrl, setFreqResponseUrl] = useState<string>('');
  const [freqResponseImg, setfreqResponseImg] = useState<File>();
  
  const [imgCataloguesUrl, setImgCataloguesUrl] = useState<image_catalogues[]>([]);
  const [imgCatalogues, setImgCatalogues] = useState<File[]>([]);


  const title = initialData ? 'Edit product' : 'Create product';
  const description = initialData ? `For ${initialData.name}` : 'Add a new product';
  const toastMessage = initialData ? 'Product updated.' : 'Product created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData ? {
    ...initialData,
  } : {
    name: '',
    images_catalogues: [],
    cover_img_url: '',
    drawing_img_url: '',
    graph_img_url: '',
    multipleDatasheetProduct: [],
    multipleFRDZMAFiles: [],
    multiple3DModels: [],
    description: '',
    sizeId: '',
    isFeatured: false,
    isArchived: false,
    // isCustom: false,
    isKits: false,
    // isCoax: false,
    // isCompressionSBAudience: false,
    // isHornSBAudience: false,
    isNewProduct: false,
    // oemQuantity: '',
    navbarNotes: '',
    searchbox_desc: '',
    tempAllFinished: false,
  }


  useEffect(() => {
    const fetchData = async () => {
      if (initialData && initialData.multipleDatasheetProduct) {
        setAllDatasheet(initialData.multipleDatasheetProduct);
      }
      if (initialData && initialData.multipleFRDZMAFiles) {
        setAllFRDZMA(initialData.multipleFRDZMAFiles);
      }
      if (initialData && initialData.multiple3DModels) {
        setAll3DModel(initialData.multiple3DModels);
      }

      if (initialData && initialData.cover_img_url) {
        setCoverImgUrl(initialData.cover_img_url);
      }
      else{
        setCoverImgUrl('')
      }

      if (initialData && initialData.drawing_img_url) {
        setDrawingImgUrl(initialData.drawing_img_url);
      }
      else{
        setDrawingImgUrl('')
      }

      if (initialData && initialData.graph_img_url) {
        setFreqResponseUrl(initialData.graph_img_url);
      }
      else{
        setFreqResponseUrl('')
      }
      
      if (initialData && initialData.images_catalogues) {
        setImgCataloguesUrl(initialData.images_catalogues);
      }
    };
  
    fetchData().catch((error) => {
      console.error("Error fetching data: ", error);
    });
  
  }, [params.productId, initialData, initialData?.multipleDatasheetProduct, initialData?.multipleFRDZMAFiles, initialData?.multiple3DModels, initialData?.cover_img_url, initialData?.drawing_img_url, initialData?.graph_img_url, initialData?.images_catalogues]); 


  //MULTIPLE DATASHEET
  const addDatasheetCounter = () => {
    setAllDatasheet((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        applicationId: '',
        productId: typeof params.productId === 'string' ? params.productId : '',
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
      // const filteredfile = file.filter(Boolean);
      try {
        const uploadPromises = file.map(async (value, index) => {
          if (value) {
            const formData = new FormData();
            formData.append('file', value);
            const url = await uploadFile(formData, 'productdatasheet');
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


  //MULTIPLE FRD ZMA
  const addFRDZMACounter = () => {
    setAllFRDZMA((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        productId: typeof params.productId === 'string' ? params.productId : '',
        url: "",
        name: "",
      },
    ]);
  };

  const reduceFRDZMACounter = (index: number) => {
    setAllFRDZMA((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFRDZMAFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const tempfile = e.target.files?.[0];
    let temp = selectedFRDZMAFile
    temp[index] = tempfile!
    setSelectedFRDZMAFile(temp);
  };

  async function handleFRDZMAFileUpload(file: File[]): Promise<multiplefrdzmafiles[]> {
    if (file && file.length > 0) {
      let updatedFRDZMA = [...allFRDZMA];
      // const filteredfile = file.filter(Boolean);
      try {
        const uploadPromises = file.map(async (value, index) => {
          if (value) {
            const formData = new FormData();
            formData.append('file', value);
            const url = await uploadFile(formData, 'frdzmafiles');
            const elementIndex = updatedFRDZMA.length - (file.length - index);
            if (updatedFRDZMA[elementIndex]) {
              updatedFRDZMA[elementIndex].url = url;
            }
          }
        });

        await Promise.all(uploadPromises);
        return updatedFRDZMA;
      } catch (error) {
        console.error("Error uploading files:", error);
        return [];
      }
    }  
    return [];
  }
  

  //MULTIPLE 3D MOdel
  const add3DModelCounter = () => {
    setAll3DModel((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        productId: typeof params.productId === 'string' ? params.productId : '',
        url: "",
        name: "",
      },
    ]);
  };

  const reduce3DModelCounter = (index: number) => {
    setAll3DModel((prev) => prev.filter((_, i) => i !== index));
  };

  const handle3DModelFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const tempfile = e.target.files?.[0];
    let temp = selected3DModel
    temp[index] = tempfile!
    setSelected3DModel(temp);
  };

  async function handle3DModelFileUpload(file: File[]): Promise<multiple3dmodels[]> {
    if (file && file.length > 0) {
      let updated3DModel = [...all3DModel];
      // const filteredfile = file.filter(Boolean);
      try {
        const uploadPromises = file.map(async (value, index) => {
          if (value) {
            const formData = new FormData();
            formData.append('file', value);
            const url = await uploadFile(formData, '3dmodels');
            const elementIndex = updated3DModel.length - (file.length - index);
            if (updated3DModel[elementIndex]) {
              updated3DModel[elementIndex].url = url;
            }
          }
        });

        await Promise.all(uploadPromises);
        return updated3DModel;
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
  
        const url = await uploadImage(formData, 'productimage');
        updatedCoverImage = url;
        return updatedCoverImage;
      } catch (error) {
        console.error("Error uploading cover image:", error);
        return '';
      }
    }
    return '';
  }


   //DRAWING IMAGE
   const handleDrawingImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return
    if (file.size > MAX_SIZE) {
      alert("File size must be less than 2MB");
      e.target.value = "";
      return;
    }
    setDrawingImg(file);
  };

  const deleteDrawingImage = async () => {
    setDrawingImgUrl('')
  }

  async function handleDrawingImageUpload(file: File): Promise<string> {
    if (file) {
      let updatedDrawingImage = drawingImgUrl
      try {
        const formData = new FormData();
        formData.append('image', file);
  
        const url = await uploadImage(formData, 'productdrawing');
        updatedDrawingImage = url;
        return updatedDrawingImage;
      } catch (error) {
        console.error("Error uploading drawing image:", error);
        return '';
      }
    }
    return '';
  }


  //FREQUENCY RESPONSE IMAGE
  const handleFrequencyResponseImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return
    if (file.size > MAX_SIZE) {
      alert("File size must be less than 2MB");
      e.target.value = "";
      return;
    }
    setfreqResponseImg(file);
  };

  const deleteFrequencyResponseImage = async () => {
    setFreqResponseUrl('')
  }

  async function handleFrequencyResponseImageUpload(file: File): Promise<string> {
    if (file) {
      let updatedFrequencyResponseImage = freqResponseUrl
      try {
        const formData = new FormData();
        formData.append('image', file);
  
        const url = await uploadImage(formData, 'productfrequencyresponse');
        updatedFrequencyResponseImage = url;
        return updatedFrequencyResponseImage;
      } catch (error) {
        console.error("Error uploading frequency response image:", error);
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
        productId: typeof params.productId === 'string' ? params.productId : '',
        applicationId: '',
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
      // const filteredfile = file.filter(Boolean);
      // console.log("filteredfile: ", filteredfile)
      try {
        const uploadPromises = file.map(async (value, index) => {
          if (value) {
            const formData = new FormData();
            formData.append('image', value);
            const url = await uploadImage(formData, 'productimage');
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


  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
        
      if (selectedDatasheetFile && selectedDatasheetFile.length > 0) {
        data.multipleDatasheetProduct = await handleDatasheetFileUpload(selectedDatasheetFile)
      }
      else{
        data.multipleDatasheetProduct = allDatasheet
      }
     
      if (selectedFRDZMAFile && selectedFRDZMAFile.length > 0) {
        data.multipleFRDZMAFiles = await handleFRDZMAFileUpload(selectedFRDZMAFile)
      }
      else{
        data.multipleFRDZMAFiles = allFRDZMA
      }
     
      if (selected3DModel && selected3DModel.length > 0) {
        data.multiple3DModels = await handle3DModelFileUpload(selected3DModel)
      }
      else{
        data.multiple3DModels = all3DModel
      }

      if (coverImg) {
        data.cover_img_url = await handleCoverImageUpload(coverImg)
      }
      else{
        data.cover_img_url = coverImgUrl
      }

      if (drawingImg) {
        data.drawing_img_url = await handleDrawingImageUpload(drawingImg)
      }
      else{
        data.drawing_img_url = drawingImgUrl
      }

      if (freqResponseImg) {
        data.graph_img_url = await handleFrequencyResponseImageUpload(freqResponseImg)
      }
      else{
        data.graph_img_url = freqResponseUrl
      }

      if (imgCatalogues && imgCatalogues.length > 0) {
        data.images_catalogues = await handleImageCataloguesFileUpload(imgCatalogues)
      }
      else{
        data.images_catalogues = imgCataloguesUrl
      }

      // data.isKits || data.isCoax ? data.isCustom = true : data.isCustom = false;
      data.description =  editor && editor.getHTML() ? editor.getHTML() : '';



      let response: AxiosResponse;
      if (initialData) {
        response = await axios.patch(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/products/${params.productId}`, data);
      } else {
        response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/products`, data);
      }
      if(response.data === 'duplicate'){
        toast.error("Duplicate Product")
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
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/products`);
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
              const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
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
      const url = window.prompt('Ex: https://sbacoustics.com/products/sb12pac25-4', previousUrl)
  
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
                      <Input disabled={loading} placeholder="Product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="pb-2">
              <FormField
                control={form.control}
                name="sizeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-base">Size</FormLabel>
                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} placeholder="Select a size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizes.map((size) => (
                          <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
 
          </div>

        </div>


      <div className="grid grid-cols-1 gap-4 border rounded-lg p-4 shadow-lg bg-background">
        <div className="font-bold text-base pb-2">Description | <Link href={'/images/admin/description_placement.png'} target="blank" className="text-primary hover:underline font-normal text-sm  ">See where this will be shown</Link></div>
        {/* <FormControl> */}
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
          <EditorContent editor={editor} className="border p-4"/>
          </div>
        </div>
        



        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 shadow-lg bg-background">
            <div className="text-center pb-2">
              <div className="text-left font-bold text-base">Drawing Image</div>
            </div>
            <div className="space-y-2 border shadow-md  rounded-lg p-2">
                <div
                  className="flex items-center justify-between rounded-md shadow-xs"
                >
                    {drawingImgUrl !== '' ? 
                    <>
                      <div className="flex items-center space-x-4">
                      <Image
                      src={drawingImgUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${drawingImgUrl}` : drawingImgUrl}
                      alt={initialData?.name? initialData?.name : ''}
                      width={100}
                      height={100}
                      className="w-32 h-fit"
                      />
                      <Button
                        variant={"destructive"}
                        onClick={() => deleteDrawingImage()}
                      >
                        <Trash width={20} height={20} />
                      </Button>
                      </div>
                      </>
                      :
                      <Input
                        type="file"
                        accept="image/*"
                        name="file"
                        onChange={(e) =>
                          e.target.files && handleDrawingImageChange(e)
                        }
                        disabled={loading}
                        className="border border-gray-300 p-2 rounded-md"
                      />
                    }
                </div>
            </div>
          </div>

          
          <div className="border rounded-lg p-4 shadow-lg bg-background">
            <div className="text-center pb-2">
              <div className="text-left font-bold text-base">Frequency Response Image</div>
            </div>
            <div className="space-y-2 rounded-lg border shadow-md p-2">
                <div
                  className="flex items-center justify-between rounded-md shadow-xs"
                >
                  <div className="flex items-center space-x-4">
                    {freqResponseUrl !== '' ?
                    <>
                      <Image
                      src={freqResponseUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${freqResponseUrl}` : freqResponseUrl}
                      alt={initialData?.name? initialData?.name : ''}
                      width={100}
                      height={100}
                      className="w-32 h-fit"
                      />
                    <Button
                      variant={"destructive"}
                      onClick={() => deleteFrequencyResponseImage()}
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
                          e.target.files && handleFrequencyResponseImageChange(e)
                        }
                        disabled={loading}
                        className="border border-gray-300 p-2 rounded-md"
                      />
                    }
                  </div>
                </div>
            </div>
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


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 shadow-lg bg-background">
            <div className="text-center pb-2 flex justify-between items-center">
              <div className="text-left font-bold text-base">FRD & ZMA</div>
              <div
                onClick={addFRDZMACounter}
                className="flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors p-2 rounded-lg hover:cursor-pointer"
              >
                <CirclePlus width={20} height={20} />Add FRD & ZMA
              </div>
            </div>
            <div className="space-y-2 rounded-lg border shadow-md p-2">
              {allFRDZMA.map((value, index) => (
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
                        accept=".pdf, .zip, .zma, .frd"
                        name="file"
                        onChange={(e) =>
                          e.target.files && handleFRDZMAFileChange(e, index)
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
                        const updatedFRDZMA = [...allFRDZMA];
                        if(updatedFRDZMA[index]){
                          updatedFRDZMA[index].name = e.target.value;
                        }
                        setAllFRDZMA(updatedFRDZMA);
                      }}
                      required
                      className="border border-gray-300 p-2 rounded-md w-48"
                    />
                  </div>
                  <Button
                    variant={"destructive"}
                    onClick={() => reduceFRDZMACounter(index)}
                  >
                    <Trash width={20} height={20} />
                  </Button>
                </div>
              ))}
            </div>
          </div>


          <div className="border rounded-lg p-4 shadow-lg bg-background">
            <div className="text-center pb-2 flex justify-between items-center">
              <div className="text-left font-bold text-base">3D Models</div>
              <div
                onClick={add3DModelCounter}
                className="flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors p-2 rounded-lg hover:cursor-pointer"
              >
                <CirclePlus width={20} height={20} />Add 3D Model
              </div>
            </div>
            <div className="space-y-2 rounded-lg border shadow-md p-2">
              {all3DModel.map((value, index) => (
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
                        accept=".zip, .STEP"
                        name="file"
                        onChange={(e) =>
                          e.target.files && handle3DModelFileChange(e, index)
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
                        const updated3DModel = [...all3DModel];
                        if(updated3DModel[index]){
                          updated3DModel[index].name = e.target.value;
                        }
                        setAll3DModel(updated3DModel);
                      }}
                      required
                      className="border border-gray-300 p-2 rounded-md w-48"
                    />
                  </div>
                  <Button
                    variant={"destructive"}
                    onClick={() => reduce3DModelCounter(index)}
                  >
                    <Trash width={20} height={20} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 border rounded-lg p-4 shadow-lg bg-background">
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className={`flex flex-row items-center space-x-3 space-y-0 border rounded-lg p-4 shadow-lg duration-300 ease-in-out ${field.value ? 'shadow-primary/70' : ''}`}>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-bold text-base">
                      Featured
                    </FormLabel>
                    <FormDescription>
                      This product will appear on the homepage slideshow. To be displayed, add the backgorund image through the <b>Featured Products</b> menu. <Link href={'/images/admin/featured_product_placement.png'} target="blank" className="text-primary hover:underline">See here for the placement</Link>
                    </FormDescription>
                    {/* <div className="text-xs font-semibold">Note: To be displayed, you need to add the backgorund image through the &quot;Featured Products&quot; menu.</div> */}
                  </div>
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="isNewProduct"
                render={({ field }) => (
                  <FormItem className={`flex flex-row items-center space-x-3 space-y-0 border rounded-lg p-4 shadow-lg duration-300 ease-in-out ${field.value ? 'shadow-primary/70' : ''}`}>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-bold text-base">
                        New Product
                      </FormLabel>
                      <FormDescription>
                      This product will appear in <b>New Products</b> page. <Link href={'/images/admin/new-product-placement.png'} target="blank" className="text-primary hover:underline">See where this will be shown</Link>
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className={`flex flex-row items-center space-x-3 space-y-0 border rounded-lg p-4 shadow-lg duration-300 ease-in-out ${field.value ? 'shadow-primary/70' : ''}`}>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-bold text-base">
                      Archived
                    </FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the website.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {params.brandId === process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID && 
            <>
              <FormField
              control={form.control}
              name="isKits"
              render={({ field }) => (
                <FormItem className={`flex flex-row items-center space-x-3 space-y-0 border rounded-lg p-4 shadow-lg duration-300 ease-in-out ${field.value ? 'shadow-primary/70' : ''}`}>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-bold text-base">
                      Kits Product
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            </>
           }
          
            </div>   
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 border rounded-lg p-4 shadow-lg bg-background">
            <FormField
              control={form.control}
              name="navbarNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-base">Notes for Dropdown | <Link href={'/images/admin/dropdown_notes_placement.png'} target="blank" className="text-primary hover:underline font-normal text-sm">See where this will be shown</Link></FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Insert the notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="searchbox_desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-base">Description for Searchbox | <Link href={'/images/admin/custom_searchbox_desc_placement.png'} target="blank" className="text-primary hover:underline font-normal text-sm">See where this will be shown</Link></FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Insert description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <div>
              <FormField
                control={form.control}
                name="tempAllFinished"
                render={({ field }) => (
                  <FormItem className={`flex flex-row items-center space-x-3 space-y-0 border rounded-lg p-4 shadow-lg duration-300 ease-in-out bg-background ${field.value ? 'shadow-primary/70' : ''}`}>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-bold text-base">
                        All Finished (Temporary untuk Mas Mirza)
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          <Button disabled={loading} type="submit" className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
