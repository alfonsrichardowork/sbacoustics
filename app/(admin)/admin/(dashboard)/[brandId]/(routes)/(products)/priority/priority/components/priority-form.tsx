"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GripVertical } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Heading } from "@/app/(admin)/admin/components/ui/heading";
import { Separator } from "@/app/(admin)/admin/components/ui/separator";
import { Button } from "@/app/(admin)/admin/components/ui/button";
import { PriorityMenu } from "@/app/(frontend)/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/(admin)/admin/components/ui/accordion";
import { Loader } from "@/app/(admin)/admin/components/ui/loader";


interface PriorityFormProps {
  initialData: PriorityMenu[];
  allCat: string[];
  allSubCat: string[];
}

export const PriorityForm: React.FC<PriorityFormProps> = ({
  initialData,
  allCat,
  allSubCat,
}) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [groupedProducts, setGroupedProducts] = useState<Record<string, PriorityMenu[]>>({});
  const [draggedIndex, setDraggedIndex] = useState<Record<string, number | null>>({});

  const title = initialData ? "Edit Menu Priority" : "Create Priority";
  const toastMessage = initialData ? "Priority updated." : "Priority created.";
  const action = initialData ? "Save changes" : "Create";

  useEffect(() => {
    const grouped: Record<string, PriorityMenu[]> = {};

    initialData.forEach((item) => {
      if(item.productName != ""){
        const adjustedCategory = item.categoryName;
        const key = `${item.menuType}_${adjustedCategory}`;

        if (!grouped[key]) {
          grouped[key] = [];
        }

        grouped[key].push(item);
      }
    });

    // Sort each group by priority
    Object.keys(grouped).forEach((key) => {
      grouped[key] && grouped[key].sort((a, b) => Number(a.priority) - Number(b.priority));
    });


    setGroupedProducts(grouped);
    setInitialLoading(false)
  }, [initialData]);

  const handleDragStart = (groupKey: string, index: number) => {
    setDraggedIndex((prev) => ({ ...prev, [groupKey]: index }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, groupKey: string, dropIndex: number) => {
    e.preventDefault();
    const fromIndex = draggedIndex[groupKey];
    if (fromIndex === null || fromIndex === undefined) return;

    const currentGroup = groupedProducts[groupKey];
    if (!currentGroup) return;

    const updatedGroup = [...currentGroup];
    const [movedItem] = updatedGroup.splice(fromIndex, 1);
    if (!movedItem) return;
    updatedGroup.splice(dropIndex, 0, movedItem);

    // Update priorities
    updatedGroup.forEach((item, i) => {
      item.priority = (i + 1).toString();
    });

    setGroupedProducts((prev) => ({
      ...prev,
      [groupKey]: updatedGroup,
    }));

    setDraggedIndex((prev) => ({
      ...prev,
      [groupKey]: null,
    }));
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      let payload: PriorityMenu[] = [];

      Object.entries(groupedProducts).forEach(([_, group]) => {
        group.forEach((item) => {
          payload.push(item);
        });
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/priority`,
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
        <Heading title={title} description="Drag and Drop to Set Priority" />
      </div>
      <Separator />

      {allCat.map((cat) => (
        <div key={cat} className="p-4 rounded-lg shadow-lg bg-background border w-full">
          <h2 className="text-2xl font-bold mb-2 flex items-center justify-center text-foreground rounded-lg">{cat}</h2>
          {initialLoading ? 
            <div className="w-full flex items-center justify-center"><Loader/></div> 
          :
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
              {allSubCat.map((subCat) => {
                const groupKey = `${cat}_${subCat}`;
                const products = groupedProducts[groupKey] || [];

                // Skip rendering if no products
                if (products.length === 0) return null;

                return (
                  <Accordion
                    key={groupKey}
                    type="single"
                    collapsible
                    className="w-full px-4 border border-foreground rounded-lg"
                    defaultValue="item-1"
                  >
                    <AccordionItem value={groupKey}>
                      <AccordionTrigger className="hover:text-primary hover:cursor-pointer">{subCat}</AccordionTrigger>
                  {/* <div key={groupKey} className="border-2 border-foreground rounded-lg p-4">
                    <div className="font-bold pb-2">{subCat}</div> */}
                    {products.map((prod, index) => (

                      <AccordionContent className="flex flex-col text-balance px-2 py-1" key={`${prod.productId}_${prod.categoryName}`}>
                      <div
                        key={`${prod.productId}_${prod.categoryName}`}
                        draggable
                        onDragStart={() => handleDragStart(groupKey, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, groupKey, index)}
                        className={`flex items-center justify-between w-full hover:bg-zinc-100 hover:shadow-primary duration-200 ease-in-out py-2 px-2 rounded-lg cursor-move shadow-sm ${
                          draggedIndex[groupKey] === index ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <div className="text-left">{prod.productName}</div>
                        </div>
                        {prod.priority === '999' &&
                          <div className="text-right">
                            <span className="text-sm text-primary">
                              Newly added!
                            </span>
                          </div>
                        }
                      </div>
                      </AccordionContent>
                    ))}
                    </AccordionItem>
                    </Accordion>
                  // </div>
                );
              })}
            </div>
          }
        </div>
      ))}

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
