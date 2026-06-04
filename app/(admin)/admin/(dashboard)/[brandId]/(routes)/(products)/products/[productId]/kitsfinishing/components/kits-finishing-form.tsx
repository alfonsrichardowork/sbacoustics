"use client"

import React from "react"

import { useEffect, useState } from "react"
import { allfinishing, kitsfinishing } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/app/(admin)/admin/components/ui/button"

import { Separator } from "@/app/(admin)/admin/components/ui/separator"
import { Heading } from "@/app/(admin)/admin/components/ui/heading"
import axios from "axios"
import toast from "react-hot-toast"
import Image from "next/image"
import { Plus, Trash } from "lucide-react"
import Link from "next/link"
import { uploadImage } from "@/app/(admin)/admin/upload-image"
import { Input } from "@/components/ui/input"
import { MAX_SIZE } from "@/app/(admin)/admin/model/model"

interface KitsFinishingFormProps {
  initialData: kitsfinishing[] | null;
  allFinishing: allfinishing[] | null;
  name: String;
};

export const KitsFinishingForm: React.FC<KitsFinishingFormProps> = ({
  initialData, allFinishing, name
}) => {
  const params = useParams();
  const router = useRouter();
  const [allSelectedFinishing, setAllSelectedFinishing] = useState<kitsfinishing[]>([]);
  const [loading, setLoading] = useState(false);
  const [finishingImage, setFinishingImage] = useState<Record<string, string>>({})
  const [selectedImage, setSelectedImage] = useState<Record<string, File>>({});
    
  const title = initialData ? 'Edit Kits Finishing' : 'Add Kits Finishing';
  const description = `For ${name}`;
  const toastMessage = initialData ? 'Kits Finishing updated.' : 'Kits Finishing Added.';
  const action = initialData ? 'Save changes' : 'Create';
  
  useEffect(() => {
    setAllSelectedFinishing(initialData || []);
    let temp: Record<string, string> = {}
    allFinishing && allFinishing.map((val) => {
      temp[val.id] = ''
    })

    initialData && initialData.map((val) => {
      temp[val.finishingId] = val.url
    })
    setFinishingImage(temp)
  }, []);

  const deleteImage = (id: string) => {
    setFinishingImage(prev => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
  }

  const handleImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return
    if (file.size > MAX_SIZE) {
      alert("File size must be less than 2MB");
      e.target.value = "";
      return;
    }
    setSelectedImage(prev => ({
      ...prev,
      [id]: file
    }))
  };

  async function handleImageUpload (file: File): Promise<string> {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const url = await uploadImage(formData, 'finishing');
        return url;
        } catch (error) {
        console.error("Error uploading finishing Image:", error);
        return '';
      }
    }
    return '';
  };
    
  
  function addFinishing(newFinishing: allfinishing) {
    if(allSelectedFinishing.length > 0) {
      setAllSelectedFinishing(prev => {
        const exists = prev.some(v => v.finishingId === newFinishing.id);

        if (exists) {
          return prev.filter(v => v.finishingId !== newFinishing.id);
        }

        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            productId: String(params.productId),
            finishingId: newFinishing.id,
            url: '',
            order: prev.length + 1
          }
        ];
      });
    }
    else{
      let temp: kitsfinishing[] = [{
        id: crypto.randomUUID(),
        productId: String(params.productId),
        finishingId: newFinishing.id,
        url: '',
        order: 1
      }]
      setAllSelectedFinishing(temp)
    }
  }

  const updateFinishingOrder = (finishingId: string, newOrder: number) => {
    setAllSelectedFinishing(prev => 
      prev.map(item => 
        item.finishingId === finishingId 
          ? { ...item, order: newOrder }
          : item
      )
    );
    console.log("allSelectedFinishing: ", allSelectedFinishing)
  };
 
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);

      if (allSelectedFinishing.length === 0) {
        let tempFinishing: kitsfinishing[] = [] 
        setAllSelectedFinishing(tempFinishing)
      }
      const updated = await Promise.all(
        allSelectedFinishing.map(async (item) => {
          const file = selectedImage[item.finishingId]

          if (file) {
            const url = await handleImageUpload(file)
            return {
              ...item,
              url,
              order: item.order
            }
          }


          return {
            ...item,
            url: finishingImage[item.finishingId] ?? '',
            order: item.order
          }
        })
      )

      setAllSelectedFinishing(updated)

      console.log("updated: ", updated)

      let response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/${params.productId}/kitsfinishing`, updated);
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
      router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/products`);
      router.refresh();
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
     <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
        <form onSubmit={handleSubmit} className="space-y-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {allFinishing?.map((finishing: allfinishing, index) => (
              <div
                key={index}
                className={`items-center flex space-x-2 border rounded-lg p-4 shadow-lg bg-background justify-center duration-300 ease-in-out ${
                  allSelectedFinishing.some((val) => val.finishingId === finishing.id)
                    ? 'shadow-primary'
                    : ''
                }`}
              >
                <div className="gap-1.5 leading-none flex flex-col justify-center text-center" key={index}>
                    <Image src={finishing.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finishing.url}` : finishing.url } alt={finishing.name} width={200} height={200} onClick={() => addFinishing(finishing)}/>
                  <label
                    htmlFor={`terms${index}`}
                    className="text-sm font-bold"
                  >
                    {finishing.name}
                  </label>
                  {allSelectedFinishing.some((val) => val.finishingId === finishing.id) &&
                  <div className="block space-x-4 justify-between items-center">
                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-xs font-semibold">Order:</label>
                      <Input
                        type="number"
                        min="1"
                        value={allSelectedFinishing.find(val => val.finishingId === finishing.id)?.order || 1}
                        onChange={(e) =>  updateFinishingOrder(finishing.id, e.target.value === "" ? 1 : Number(e.target.value))}
                        className="w-16"
                        disabled={loading}
                      />
                    </div>
                    {finishingImage[finishing.id] && finishingImage[finishing.id] !== '' && (
                      <Image alt={'Finishing Image'} src={finishingImage[finishing.id]?.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${finishingImage[finishing.id]}` : finishingImage[finishing.id] || ''} width={200} height={200} className="w-52 h-fit" priority/>
                    )}
                    {(!finishingImage[finishing.id] || finishingImage[finishing.id] === '') && (  
                    <Input
                      id={`file`}
                      type="file"
                      accept="image/*"
                      name="file"
                      onChange={(e) =>
                        e.target.files && handleImageChange(finishing.id, e) // Ensure your file upload function can handle image files
                      }
                      // required
                      disabled={loading}
                      className="border border-gray-300 p-2 rounded-md"
                    />
                    )}
                    {finishingImage[finishing.id] && finishingImage[finishing.id] !== '' && (
                    <Button
                      variant={"destructive"}
                      onClick={() => deleteImage(finishing.id)}
                    >
                      <Trash width={20} height={20} />
                    </Button>
                  )}
                  </div>
                }
                </div>
              </div>
            ))}
              <Link
                className={`items-center flex space-x-2 border rounded-lg p-4 shadow-lg bg-background justify-center duration-300 ease-in-out`}
                href={`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/allfinishing/new`}
              >
                <div className="gap-1.5 leading-none flex items-center justify-center text-center">
                  <Plus size={20} /> Add New Finishing
                </div>
              </Link>
          </div>
          <Button disabled={loading} className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors" type="submit">
            {action}
          </Button>
        </form>
    </>
  );
};
