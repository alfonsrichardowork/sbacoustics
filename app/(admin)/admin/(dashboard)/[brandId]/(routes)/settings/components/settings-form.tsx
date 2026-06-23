"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Check, ChevronsUpDown, CirclePlus, Trash, X } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Input } from "@/app/(admin)/admin/components/ui/input"
import { Button } from "@/app/(admin)/admin/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/(admin)/admin/components/ui/form"
import { Separator } from "@/app/(admin)/admin/components/ui/separator"
import { Heading } from "@/app/(admin)/admin/components/ui/heading"
import { AlertModal } from "@/app/(admin)/admin/components/modals/alert-modal"
import { useOrigin } from "@/app/(admin)/admin/hooks/use-origin"
import { brand, socialmedia } from "@prisma/client"
import Link from "next/link"
import { uploadImage } from "@/app/(admin)/admin/upload-image"
import Image from "next/image"
import { SocialIcon } from 'react-social-icons'
import { SocialNetwork, socialNetworks } from "@/lib/all-social-media"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/(admin)/admin/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/app/(admin)/admin/components/ui/command"
import { cn } from "@/lib/utils"
import { MAX_SIZE } from "@/app/(admin)/admin/model/model"

const formSchema = z.object({
  name: z.string().min(2),
  telephone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  maps: z.string().optional(),
  cover: z.string().optional(),
  homepage_brand_choice_url: z.string().optional(),
  homepage_open_source_kits_url: z.string().optional(),
  homepage_about_us_url: z.string().optional(),
  homepage_catalogues_url: z.string().optional(),
  homepage_brand_choice_text: z.string().optional(),
  homepage_open_source_kits_text: z.string().optional(),
  homepage_about_us_text: z.string().optional(),
  homepage_catalogues_text: z.string().optional(),
});

interface SelectedSocial {
  id: string
  network: string
  link: string
}

type SettingsFormValues = z.infer<typeof formSchema>

interface SettingsFormProps {
  initialData: brand;
  initialSocialMedia: socialmedia[];
};

export const SettingsForm: React.FC<SettingsFormProps> = ({
  initialData, initialSocialMedia
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactImage, setContactImage] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File>();
  
  const [homepageBrandChoiceUrl, setHomepageBrandChoiceUrl] = useState<string>('')
  const [selectedFilehomepageBrandChoiceUrl, setSelectedFilehomepageBrandChoiceUrl] = useState<File>();
  const [homepageOpenSourceKitsUrl, setHomepageOpenSourceKitsUrl] = useState<string>('')
  const [selectedFilehomepageOpenSourceKitsUrl, setSelectedFilehomepageOpenSourceKitsUrl] = useState<File>();
  const [homepageAboutUsUrl, setHomepageAboutUsUrl] = useState<string>('')
  const [selectedFilehomepageAboutUsUrl, setSelectedFilehomepageAboutUsUrl] = useState<File>();
  const [homepageCataloguesUrl, setHomepageCataloguesUrl] = useState<string>('')
  const [selectedFilehomepageCataloguesUrl, setSelectedFilehomepageCataloguesUrl] = useState<File>();

  const [openSocialNetwork, setOpenSocialNetwork] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState<SocialNetwork | null>(null)
  const [link, setLink] = useState("")
  const [socials, setSocials] = useState<SelectedSocial[]>([])

  const handleAddSocial = () => {
    if (selectedNetwork && link) {
      setSocials([...socials, { id: Date.now().toString(), network: selectedNetwork, link }])
      setSelectedNetwork(null)
      setLink("")
    }
  }

  const handleDeleteSocial = (id: string) => {
    setSocials(socials.filter((social) => social.id !== id))
  }

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });

  useEffect(() => {
  const fetchData = async () => {
    if (initialData && initialData.cover) {
      setContactImage(initialData.cover);
    }
    else{
      setContactImage('')
    }
    if (initialData && initialData.homepage_brand_choice_url) {
      setHomepageBrandChoiceUrl(initialData.homepage_brand_choice_url);
    }
    else{
      setHomepageBrandChoiceUrl('')
    }
    if (initialData && initialData.homepage_open_source_kits_url) {
      setHomepageOpenSourceKitsUrl(initialData.homepage_open_source_kits_url);
    }
    else{
      setHomepageOpenSourceKitsUrl('')
    }
    if (initialData && initialData.homepage_about_us_url) {
      setHomepageAboutUsUrl(initialData.homepage_about_us_url);
    }
    else{
      setHomepageAboutUsUrl('')
    }
    if (initialData && initialData.homepage_catalogues_url) {
      setHomepageCataloguesUrl(initialData.homepage_catalogues_url);
    }
    else{
      setHomepageCataloguesUrl('')
    }
    if(initialSocialMedia && initialSocialMedia.length > 0) {
      let temp: SelectedSocial[] = []
      initialSocialMedia.map((val: socialmedia) => {
        let singleTemp: SelectedSocial = {
          id: val.id,
          network: val.type,
          link: val.value
        }
        temp.push(singleTemp)
      })
      setSocials(temp)
    }
  };
  
  fetchData().catch((error) => {
    console.error("Error fetching contact image: ", error);
  });
  }, [params.superiorId, initialData, initialData.cover, initialData.homepage_brand_choice_url, initialData.homepage_open_source_kits_url, initialData.homepage_about_us_url, initialData.homepage_catalogues_url, initialSocialMedia]);


  const deleteImage = async () => {
    setContactImage('')
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return
    if (file.size > MAX_SIZE) {
      alert("File size must be less than 2MB");
      e.target.value = "";
      return;
    }
    setSelectedFile(file);
  };

  async function handleImageUpload (file: File): Promise<string> {
    if (file) {
      let updatedContactImage = contactImage;
      try {
        const formData = new FormData();
        formData.append('image', file);

        const url = await uploadImage(formData, 'other');
        updatedContactImage = url
        return updatedContactImage;
        } catch (error) {
        console.error("Error uploading contact image:", error);
        return '';
      }
    }
    return '';
  };

  

  const deleteImageBrandChoice = async () => {
    setHomepageBrandChoiceUrl('')
  };

  const handleFileChangeBrandChoice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return
    if (file.size > MAX_SIZE) {
      alert("File size must be less than 2MB");
      e.target.value = "";
      return;
    }
    setSelectedFilehomepageBrandChoiceUrl(file);
  };

  async function handleImageUploadBrandChoice (file: File): Promise<string> {
    if (file) {
      let updatedHomepageBrandChoiceUrl = homepageBrandChoiceUrl;
      try {
        const formData = new FormData();
        formData.append('image', file);

        const url = await uploadImage(formData, 'other');
        updatedHomepageBrandChoiceUrl = url
        return updatedHomepageBrandChoiceUrl;
        } catch (error) {
        console.error("Error uploading brand choice image:", error);
        return '';
      }
    }
    return '';
  };


    const deleteImageOpenSourceKits = async () => {
    setHomepageOpenSourceKitsUrl('')
  };

  const handleFileChangeOpenSourceKits = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return
    if (file.size > MAX_SIZE) {
      alert("File size must be less than 2MB");
      e.target.value = "";
      return;
    }
    setSelectedFilehomepageOpenSourceKitsUrl(file);
  };

  async function handleImageUploadOpenSourceKits (file: File): Promise<string> {
    if (file) {
      let updatedHomepageOpenSourceKitsUrl = homepageOpenSourceKitsUrl;
      try {
        const formData = new FormData();
        formData.append('image', file);

        const url = await uploadImage(formData, 'other');
        updatedHomepageOpenSourceKitsUrl = url
        return updatedHomepageOpenSourceKitsUrl;
        } catch (error) {
        console.error("Error uploading open source kits image:", error);
        return '';
      }
    }
    return '';
  };


  const deleteImageAboutUs = async () => {
    setHomepageAboutUsUrl('')
  };

  const handleFileChangeAboutUs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return
    if (file.size > MAX_SIZE) {
      alert("File size must be less than 2MB");
      e.target.value = "";
      return;
    }
    setSelectedFilehomepageAboutUsUrl(file);
  };

  async function handleImageUploadAboutUs (file: File): Promise<string> {
    if (file) {
      let updatedHomepageAboutUsUrl = homepageAboutUsUrl;
      try {
        const formData = new FormData();
        formData.append('image', file);

        const url = await uploadImage(formData, 'other');
        updatedHomepageAboutUsUrl = url
        return updatedHomepageAboutUsUrl;
        } catch (error) {
        console.error("Error uploading about us image:", error);
        return '';
      }
    }
    return '';
  };
  

  const deleteImageCatalogues = async () => {
    setHomepageCataloguesUrl('')
  };

  const handleFileChangeCatalogues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return
    if (file.size > MAX_SIZE) {
      alert("File size must be less than 2MB");
      e.target.value = "";
      return;
    }
    setSelectedFilehomepageCataloguesUrl(file);
  };

  async function handleImageUploadCatalogues (file: File): Promise<string> {
    if (file) {
      let updatedHomepageCataloguesUrl = homepageCataloguesUrl;
      try {
        const formData = new FormData();
        formData.append('image', file);

        const url = await uploadImage(formData, 'other');
        updatedHomepageCataloguesUrl = url
        return updatedHomepageCataloguesUrl;
        } catch (error) {
        console.error("Error uploading catalogues image:", error);
        return '';
      }
    }
    return '';
  };


  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);

      if (selectedFile) {
        data.cover = await handleImageUpload(selectedFile);
      }
      else{
        data.cover = contactImage
      }
      
      if (selectedFilehomepageBrandChoiceUrl) {
        data.homepage_brand_choice_url = await handleImageUploadBrandChoice(selectedFilehomepageBrandChoiceUrl);
      }
      else{
        data.homepage_brand_choice_url = homepageBrandChoiceUrl
      }
      
      if (selectedFilehomepageOpenSourceKitsUrl) {
        data.homepage_open_source_kits_url = await handleImageUploadOpenSourceKits(selectedFilehomepageOpenSourceKitsUrl);
      }
      else{
        data.homepage_open_source_kits_url = homepageOpenSourceKitsUrl
      }
      
      if (selectedFilehomepageAboutUsUrl) {
        data.homepage_about_us_url = await handleImageUploadAboutUs(selectedFilehomepageAboutUsUrl);
      }
      else{
        data.homepage_about_us_url = homepageAboutUsUrl
      }
      
      if (selectedFilehomepageCataloguesUrl) {
        data.homepage_catalogues_url = await handleImageUploadCatalogues(selectedFilehomepageCataloguesUrl);
      }
      else{
        data.homepage_catalogues_url = homepageCataloguesUrl
      }

      const response = await axios.patch(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/brands/${params.brandId}`, 
      {
        data,
        socials,
      });
      if(response.data === 'expired_session'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/`);
        router.refresh();
        toast.error("Session expired, please login again")
      }
      else if(response.data === 'invalid_token'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/`);
        router.refresh();
        toast.error("API Token Invalid, please login again")
      }
      else if(response.data === 'not_admin'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/`);
        router.refresh();
        toast.error("Unauthorized!")
      }
      else{
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}`);
        router.refresh();
        toast.success('Brand updated.');
      }
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/brands/${params.brandId}`);
      router.refresh();
      router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}`);
      toast.success('Brand deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all products and categories first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
    <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
     <div className="flex items-center justify-between">
        <Heading title="Brand settings" description="Manage brand preferences" />
        <Button
          disabled={loading}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="border bg-background rounded-lg p-4 shadow-lg">
            <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
              <div>
                <div className="pb-2">
                  <FormField
                    control={form.control}
                    name="name"
                    // disabled
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base">Name</FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="Brand name" {...field} className="bg-background"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="pb-2">
                  <div className="text-left font-bold">Contact Cover Image</div>
                  <div className="flex space-x-4 justify-between items-center">
                    {contactImage !== "" ?
                      <>
                        <Image alt={'Contact Cover Image'} src={contactImage.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${contactImage}` : contactImage} width={200} height={200} className="w-52 h-fit" priority/>
                        <Button
                          variant={"destructive"}
                          onClick={() => deleteImage()}
                        >
                          <Trash width={20} height={20} />
                        </Button>
                      </>
                    :
                    <Input
                      id={`file`}
                      type="file"
                      accept="image/*"
                      name="file"
                      onChange={(e) =>
                        e.target.files && handleFileChange(e) // Ensure your file upload function can handle image files
                      }
                      disabled={loading}
                      className="border border-gray-300 p-2 rounded-md"
                    />
                    }
                  </div>
                </div>
                <div className="pb-2">
                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Telephone Number</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Brand telephone" {...field} className="bg-background"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                <div className="pb-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Email</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Brand email" {...field} className="bg-background"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                <div className="pb-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Address</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Brand address" {...field} className="bg-background"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                <div className="pb-2">
                <FormField
                  control={form.control}
                  name="maps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base flex gap-2">
                        Maps Url
                      </FormLabel>
                      <div className="text-sm font-bold">Steps:</div>
                      <div className="text-sm">
                        <div className="flex gap-1">1.Open <Link href={`https://www.google.com/maps`} target="_blank" className="underline hover:text-[rgba(19,82,219,1)]/80 text-[rgba(19,82,219,1)]">Google Map</Link></div>
                        <div>2.Input the location name</div>
                        <div>3.Klik Share</div>
                        <div>4.embed a map</div>
                        <div>5.COPY HTML</div>
                      </div>
                      <FormControl>
                        <Input disabled={loading} placeholder="maps" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                


              </div>
              <div>
                <div>
                  <label className="font-bold text-base flex gap-2">Select Social Media</label>
                  <Popover open={openSocialNetwork} onOpenChange={setOpenSocialNetwork}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openSocialNetwork}
                        className="w-full justify-between bg-transparent capitalize"
                      >
                        {selectedNetwork ? socialNetworks.find((network) => network === selectedNetwork) : "Select a network..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search networks..." />
                        <CommandEmpty>No Social Media found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {socialNetworks.map((network) => (
                              <CommandItem
                                key={network}
                                value={network}
                                onSelect={(currentValue) => {
                                  setSelectedNetwork(currentValue as SocialNetwork)
                                  setOpenSocialNetwork(false)
                                }}
                                className="capitalize gap-2"
                              >
                                <Check
                                  className={cn("mr-2 h-4 w-4", selectedNetwork === network ? "opacity-100" : "opacity-0")}
                                />
                                <SocialIcon network={network} style={{ width: 40, height: 40 }} /> {network}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {selectedNetwork && (
                    <div className="mt-2 flex w-full gap-2 items-center justify-between">
                      <div className="flex items-center gap-3 p-2 rounded-lg border">
                        <span className="text-2xl">
                          <SocialIcon network={selectedNetwork} style={{ width: 30, height: 30 }} />
                        </span>
                        <span className="font-medium capitalize">{selectedNetwork}</span>
                      </div>

                      <div className="w-full">
                        <Input
                          id="link"
                          placeholder="Enter link..."
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                          className="w-full"
                          required
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={handleAddSocial}
                        className="bg-green-500 text-primary-foreground hover:opacity-90 hover:bg-green-600 gap-2"
                        aria-label="Add another parent group"
                      >
                        <CirclePlus width={20} height={20} />
                        Add
                      </Button>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  {socials.length > 0 && (
                      <div className="">
                        <h3 className="font-bold text-base flex gap-2">Added Social Media</h3>
                        <div className="space-y-2">
                          {socials.map((social) => (
                            <div key={social.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-2xl">
                                  <SocialIcon network={social.network} style={{ width: 40, height: 40 }} />
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium capitalize">{social.network}</p>
                                  <p className="text-xs text-muted-foreground truncate">{social.link}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSocial(social.id)}
                                className="ml-2 h-8 w-8 p-0"
                                aria-label={`Delete ${social.network}`}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              
                <div className="pb-2">
                  <div className="text-left font-bold">Brand Choice Image</div>
                  <div className="flex space-x-4 justify-between items-center">
                    {homepageBrandChoiceUrl !== "" ?
                      <>
                        <Image alt={'Brand Choice Image'} src={homepageBrandChoiceUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${homepageBrandChoiceUrl}` : homepageBrandChoiceUrl} width={200} height={200} className="w-52 h-fit" priority/>
                        <Button
                          variant={"destructive"}
                          onClick={() => deleteImageBrandChoice()}
                        >
                          <Trash width={20} height={20} />
                        </Button>
                      </>
                    :
                    <Input
                      id={`file`}
                      type="file"
                      accept="image/*"
                      name="file"
                      onChange={(e) =>
                        e.target.files && handleFileChangeBrandChoice(e) // Ensure your file upload function can handle image files
                      }
                      disabled={loading}
                      className="border border-gray-300 p-2 rounded-md"
                    />
                    }
                  </div>
                </div>
                <div className="pb-2">
                  <FormField
                    control={form.control}
                    name="homepage_brand_choice_text"
                    // disabled
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base">Brand Choice Text</FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="Brand Choice Text " {...field} className="bg-background"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                
                <div className="pb-2">
                  <div className="text-left font-bold">Open Source Kits Image</div>
                  <div className="flex space-x-4 justify-between items-center">
                    {homepageOpenSourceKitsUrl !== "" ?
                      <>
                        <Image alt={'Open Source Kits Image'} src={homepageOpenSourceKitsUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${homepageOpenSourceKitsUrl}` : homepageOpenSourceKitsUrl} width={200} height={200} className="w-52 h-fit" priority/>
                        <Button
                          variant={"destructive"}
                          onClick={() => deleteImageOpenSourceKits()}
                        >
                          <Trash width={20} height={20} />
                        </Button>
                      </>
                    :
                    <Input
                      id={`file`}
                      type="file"
                      accept="image/*"
                      name="file"
                      onChange={(e) =>
                        e.target.files && handleFileChangeOpenSourceKits(e) // Ensure your file upload function can handle image files
                      }
                      disabled={loading}
                      className="border border-gray-300 p-2 rounded-md"
                    />
                    }
                  </div>
                </div>
                <div className="pb-2">
                  <FormField
                    control={form.control}
                    name="homepage_open_source_kits_text"
                    // disabled
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base">Open Source Kits Text</FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="Open Source Kits Text " {...field} className="bg-background"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                
                <div className="pb-2">
                  <div className="text-left font-bold">About Us Image</div>
                  <div className="flex space-x-4 justify-between items-center">
                    {homepageAboutUsUrl !== "" ?
                      <>
                        <Image alt={'About Us Image'} src={homepageAboutUsUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${homepageAboutUsUrl}` : homepageAboutUsUrl} width={200} height={200} className="w-52 h-fit" priority/>
                        <Button
                          variant={"destructive"}
                          onClick={() => deleteImageAboutUs()}
                        >
                          <Trash width={20} height={20} />
                        </Button>
                      </>
                    :
                    <Input
                      id={`file`}
                      type="file"
                      accept="image/*"
                      name="file"
                      onChange={(e) =>
                        e.target.files && handleFileChangeAboutUs(e) // Ensure your file upload function can handle image files
                      }
                      disabled={loading}
                      className="border border-gray-300 p-2 rounded-md"
                    />
                    }
                  </div>
                </div>
                <div className="pb-2">
                  <FormField
                    control={form.control}
                    name="homepage_about_us_text"
                    // disabled
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base">About Us Text</FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="About Us Text " {...field} className="bg-background"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                
                <div className="pb-2">
                  <div className="text-left font-bold">Catalogues Image</div>
                  <div className="flex space-x-4 justify-between items-center">
                    {homepageCataloguesUrl !== "" ?
                      <>
                        <Image alt={'Catalogues Image'} src={homepageCataloguesUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${homepageCataloguesUrl}` : homepageCataloguesUrl} width={200} height={200} className="w-52 h-fit" priority/>
                        <Button
                          variant={"destructive"}
                          onClick={() => deleteImageCatalogues()}
                        >
                          <Trash width={20} height={20} />
                        </Button>
                      </>
                    :
                    <Input
                      id={`file`}
                      type="file"
                      accept="image/*"
                      name="file"
                      onChange={(e) =>
                        e.target.files && handleFileChangeCatalogues(e) // Ensure your file upload function can handle image files
                      }
                      disabled={loading}
                      className="border border-gray-300 p-2 rounded-md"
                    />
                    }
                  </div>
                </div>
                <div className="pb-2">
                  <FormField
                    control={form.control}
                    name="homepage_catalogues_text"
                    // disabled
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base">Catalogues Text</FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="Catalogues Text " {...field} className="bg-background"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
            </div>
          </div>




          {/* <div className="border bg-background rounded-lg p-4 shadow-lg">

              <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                <div>
                  <label className="font-bold text-base flex gap-2">Select Social Media</label>
                  <Popover open={openSocialNetwork} onOpenChange={setOpenSocialNetwork}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openSocialNetwork}
                        className="w-full justify-between bg-transparent capitalize"
                      >
                        {selectedNetwork ? socialNetworks.find((network) => network === selectedNetwork) : "Select a network..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search networks..." />
                        <CommandEmpty>No Social Media found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {socialNetworks.map((network) => (
                              <CommandItem
                                key={network}
                                value={network}
                                onSelect={(currentValue) => {
                                  setSelectedNetwork(currentValue as SocialNetwork)
                                  setOpenSocialNetwork(false)
                                }}
                                className="capitalize gap-2"
                              >
                                <Check
                                  className={cn("mr-2 h-4 w-4", selectedNetwork === network ? "opacity-100" : "opacity-0")}
                                />
                                <SocialIcon network={network} style={{ width: 40, height: 40 }} /> {network}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {selectedNetwork && (
                    <div className="mt-2 flex w-full gap-2 items-center justify-between">
                      <div className="flex items-center gap-3 p-2 rounded-lg border">
                        <span className="text-2xl">
                          <SocialIcon network={selectedNetwork} style={{ width: 30, height: 30 }} />
                        </span>
                        <span className="font-medium capitalize">{selectedNetwork}</span>
                      </div>

                      <div className="w-full">
                        <Input
                          id="link"
                          placeholder="Enter link..."
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                          className="w-full"
                          required
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={handleAddSocial}
                        className="bg-green-500 text-primary-foreground hover:opacity-90 hover:bg-green-600 gap-2"
                        aria-label="Add another parent group"
                      >
                        <CirclePlus width={20} height={20} />
                        Add
                      </Button>
                    </div>
                  )}
                </div>
                <div>
                  {socials.length > 0 && (
                      <div className="">
                        <h3 className="font-bold text-base flex gap-2">Added Social Media</h3>
                        <div className="space-y-2">
                          {socials.map((social) => (
                            <div key={social.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-2xl">
                                  <SocialIcon network={social.network} style={{ width: 40, height: 40 }} />
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium capitalize">{social.network}</p>
                                  <p className="text-xs text-muted-foreground truncate">{social.link}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSocial(social.id)}
                                className="ml-2 h-8 w-8 p-0"
                                aria-label={`Delete ${social.network}`}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div> */}


          <Button disabled={loading} className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors" type="submit">
            Save changes
          </Button>
        </form>
      </Form>
    </>
  );
};
