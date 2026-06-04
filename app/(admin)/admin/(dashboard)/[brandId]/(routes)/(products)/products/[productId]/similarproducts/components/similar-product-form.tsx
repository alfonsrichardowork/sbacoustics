"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { ChevronsUpDown, Trash, } from "lucide-react"
import { product, similarproducts } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Separator } from "@/app/(admin)/admin/components/ui/separator"
import { Heading } from "@/app/(admin)/admin/components/ui/heading"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/(admin)/admin/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/(admin)/admin/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/app/(admin)/admin/components/ui/command"
import { cn } from "@/lib/utils"
import { Button } from "@/app/(admin)/admin/components/ui/button"
import Image from "next/image"
 
interface SimiliarProductFormProps {
  initialData: similarproducts[];
  initialProduct: product;
  allProducts: product[]
  // specification: Specification;
};


export const SimiliarProductForm: React.FC<SimiliarProductFormProps> = ({
  initialData,
  initialProduct,
  allProducts
}) => {
  const [allSimilar, setAllSimilar] = useState<similarproducts[]>([]);

  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [openCat, setOpenCat] = useState(false);

  const title = initialData.length > 0 ? `Edit Similar Products` : `Add Similar Products`;
  const description = `For ${initialProduct.name}`;
  const toastMessage = initialData.length > 0 ? 'Similar Products updated.' : 'Similar Products created.';
  const action = initialData.length > 0 ? 'Save changes' : 'Create';

  useEffect(() => {
    if(initialData.length > 0 && initialData){
      let tempInitial: similarproducts[] = []
      initialData.forEach((item) => {
        const similarprod: similarproducts = {
          id: item.id,
          productId: item.productId,
          similarProductId: item.similarProductId,
        };
        tempInitial.push(similarprod)
      });
      setAllSimilar(tempInitial)
    }
  }, [initialData]);

  function deleteSelectedSimilarProd(id: String){
    setAllSimilar(allSimilar.filter(item => item.id !== id))
  }
  
  function addSelectedSimilarProd(data: String){
    const foundSimilar = allProducts.find(item => item.id === data);
    if (foundSimilar) {
      const found = allSimilar.some(item => item.similarProductId === foundSimilar.id);
      if (found) {
        toast.error('Item already selected.');
      } else {
        let tempSim : similarproducts = {
          id: Math.random().toString(),
          productId: initialProduct.id,
          similarProductId: foundSimilar.id
        }
        setAllSimilar(prevSImilar => [...prevSImilar, tempSim]);
      }
    } else {
      console.log("No product found with the specified name.");
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const allFinalSimilar: similarproducts[] = [...allSimilar];
    try {
      setLoading(true);
      let response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/${params.productId}/similarproducts`, allFinalSimilar);
      if(response.data === 'expired_session'){
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


  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="md:grid md:grid-cols-2 gap-8">


          <div className="border rounded-lg p-4 shadow-lg bg-background">
            <div className="font-bold mb-2">Selected Products</div>
            <Popover open={openCat} onOpenChange={setOpenCat}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                role="combobox"
                aria-expanded={openCat}
                aria-label="Select a Brand"
                className={cn("w-full justify-between")}
              >
                Select
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandList>
                  <CommandInput placeholder="Search Similar Products..." />
                  <CommandEmpty>No Products found.</CommandEmpty>
                  <CommandGroup>
                    
                    {allProducts.map((prod) => (
                      <CommandItem
                        key={prod.name}
                        onSelect={() => {
                          addSelectedSimilarProd(prod.id);
                          setOpenCat(false);
                        }}
                        className="text-sm"
                      >
                        <Image src={prod.cover_img_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${prod.cover_img_url}` : prod.cover_img_url} alt={prod.name} width={100} height={100} className="w-16 h-fit pr-4"/>
                        {prod.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
            </Popover>
            <Table>
              <TableHeader>
                {/* <TableRow>
                  <TableHead>Selected Products</TableHead>
                  <TableHead>Delete?</TableHead>
                </TableRow> */}
              </TableHeader>
              <TableBody>
                {allSimilar?.map((similar) => {
                  const productItem = allProducts.find((product) => product.id === similar.similarProductId);
                  if (!productItem) return null;

                  const imageSrc = productItem.cover_img_url.startsWith('/uploads/')
                    ? `${process.env.NEXT_PUBLIC_ROOT_URL}${productItem.cover_img_url}`
                    : productItem.cover_img_url;

                  return (
                    <TableRow key={similar.id} className="flex justify-between items-center">
                      <TableCell className="font-medium flex items-center">
                        <Image src={imageSrc} alt={productItem.name} width={100} height={100} className="w-16 h-fit pr-4" />
                        {productItem.name}
                      </TableCell>
                      <TableCell>
                        <Button
                          disabled={loading}
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteSelectedSimilarProd(similar.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        <Button disabled={loading} className="gap-2 flex w-full bg-green-500 text-white hover:bg-green-600 transition-colors" type="submit">
              {action}
        </Button>
      </form>
      </div>
    </>
  );
};
