"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GripVertical } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { allcategory } from "@prisma/client";
import { Heading } from "@/app/(admin)/admin/components/ui/heading";
import { Loader } from "@/app/(admin)/admin/components/ui/loader";


interface PriorityFormProps {
  allCat: allcategory[]
}


interface PriorityMenuCategory{
    priority: string,
    categoryId: string,
    categoryName: string
}

export const PriorityForm: React.FC<PriorityFormProps> = ({
  allCat,
}) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [products, setProducts] = useState<PriorityMenuCategory[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const title = "Edit Navigation Menu Priority";
  const toastMessage = "Navigation Menu updated.";
  const action = "Save changes";

  useEffect(() => {
    const items: PriorityMenuCategory[] = [];

    allCat.forEach((item) => {
      items.push({
        priority: item.priority && item.priority != '' ? item.priority : '',
        categoryId: item.id,
        categoryName: item.name
      });
    });

    // Sort by priority
    items.sort((a, b) => Number(a.priority) - Number(b.priority));

    setProducts(items);
    setInitialLoading(false);
  }, [allCat]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === undefined) return;

    const updatedProducts = [...products];
    const [movedItem] = updatedProducts.splice(draggedIndex, 1);
    if (!movedItem) return;
    updatedProducts.splice(dropIndex, 0, movedItem);

    // Update priorities
    updatedProducts.forEach((item, i) => {
      item.priority = (i + 1).toString();
    });

    setProducts(updatedProducts);
    setDraggedIndex(null);
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const payload = products;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/menu/priority`,
        payload
      );

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
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}`);
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
        <Heading title={title} description="Drag and Drop to Set Menu Priority" />
      </div>
      <Separator />

        <div className="p-4 rounded-lg shadow-md border-2 shadow-primary border-primary w-full bg-background">
          <h2 className="text-2xl font-bold mb-2 flex items-center justify-center text-primary rounded-lg">Menu Priority</h2>
          {initialLoading ? 
            <div className="w-full flex items-center justify-center"><Loader/></div> 
          :
            <div className="grid grid-cols-1 gap-4">
              {products.map((type, index) => 
                <div className="flex flex-col text-balance px-2 py-1" key={`${type.categoryId}_${type.categoryName}`}>
                  <div
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`flex items-center justify-between w-full hover:bg-zinc-100 hover:shadow-primary duration-200 ease-in-out py-2 px-2 rounded-lg cursor-move shadow-sm ${
                      draggedIndex === index ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <div className="text-left">{type.categoryName}</div>
                    </div>
                    {type.priority === '' &&
                      <div className="text-right">
                        <span className="text-sm text-primary">
                          Newly added!
                        </span>
                      </div>
                    }
                  </div>
                </div>
              )}
            </div>
          }
        </div>
      {/* ))} */}

      {!initialLoading &&
        <Button
          disabled={loading}
          className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors mt-6"
          type="submit"
          onClick={onSubmit}
        >
          {action}
        </Button>
      }
    </>
  );
};
