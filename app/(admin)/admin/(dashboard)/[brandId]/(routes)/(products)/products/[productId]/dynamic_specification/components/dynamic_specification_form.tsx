"use client"

import { dynamicspecification, dynamicspecificationparent, dynamicspecificationsubparent, specificationconnector } from "@prisma/client"
import { Button } from "@/app/(admin)/admin/components/ui/button"
import { Input } from "@/app/(admin)/admin/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/(admin)/admin/components/ui/select"
import { CirclePlus, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import axios, { AxiosResponse } from "axios"
import { useParams, useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Heading } from "@/app/(admin)/admin/components/ui/heading"
import { Separator } from "@/app/(admin)/admin/components/ui/separator"
import { Loader } from "@/app/(admin)/admin/components/ui/loader"

type SpecRow = {
  id: string
  dynamicspecificationId: string
  value: string
  notes: string
}

type ParentGroup = {
  key: string
  dynamicspecificationParentId: string
  dynamicspecificationSubParentId?: string
  specs: SpecRow[]
}

function newSpecRow(): SpecRow {
  return { id: crypto.randomUUID(), dynamicspecificationId: "", value: "", notes: "" }
}

function newParentGroup(): ParentGroup {
  return {
    key: crypto.randomUUID(),
    dynamicspecificationParentId: "",
    dynamicspecificationSubParentId: undefined,
    specs: [newSpecRow()],
  }
}

interface SBAudienceCompressionDimensionSpecFormProps {
  initialData: specificationconnector[],
  allParentSpec: dynamicspecificationparent[],
  allSubParentSpec: dynamicspecificationsubparent[],
  allChildSpec: dynamicspecification[],
  productName: string
};

export const SpecForm: React.FC<SBAudienceCompressionDimensionSpecFormProps> = ({
  initialData, allParentSpec, allSubParentSpec, allChildSpec, productName
}) => {
  const [groups, setGroups] = useState<ParentGroup[]>([newParentGroup()])
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true)


  const title = initialData ? 'Edit Specification' : 'Create Specification';
  const description = initialData ? `For ${productName}` : 'Add a new product';
  const toastMessage = initialData ? 'Specification updated.' : 'Specification created.';
  const action = initialData ? 'Save changes' : 'Create';

    useEffect(() => {
      const fetchData = async () => {
        let tempFinal: ParentGroup[] = []

        initialData.forEach((val: specificationconnector) => {
          const parentId = val.dynamicspecificationParentId
          const subParentId = val.dynamicspecificationSubParentId ?? undefined

          const temp: SpecRow = {
            id: val.id,
            dynamicspecificationId: val.dynamicspecificationId,
            value: val.value,
            notes: val.notes,
          }

          const existingGroup = tempFinal.find(
            (group) => group.dynamicspecificationParentId === parentId && group.dynamicspecificationSubParentId === subParentId
          )

          if (existingGroup) {
            existingGroup.specs.push(temp)
          } else {
            tempFinal.push({
              key: crypto.randomUUID(),
              dynamicspecificationParentId: parentId,
              dynamicspecificationSubParentId: subParentId,
              specs: [temp],
            })
          }
        })

        setGroups(tempFinal)
        setLoading(false)
      };
    
      fetchData().catch((error) => {
        console.error("Error fetching data: ", error);
      });
    
    }, [initialData]); 

  function updateGroup<K extends keyof ParentGroup>(key: string, field: K, value: ParentGroup[K]) {
    setGroups((prev) => prev.map((g) => (g.key === key ? { ...g, [field]: value } : g)))
  }

  function addGroup() {
    setGroups((prev) => [...prev, newParentGroup()])
  }

  function removeGroup(key: string) {
    setGroups((prev) => prev.filter((g) => g.key !== key))
  }

  function addSpecRowToGroup(groupKey: string) {
    setGroups((prev) => prev.map((g) => (g.key === groupKey ? { ...g, specs: [...g.specs, newSpecRow()] } : g)))
  }

  function removeSpecRowFromGroup(groupKey: string, rowId: string) {
    setGroups((prev) =>
      prev.map((g) => (g.key === groupKey ? { ...g, specs: g.specs.filter((r) => r.id !== rowId) } : g)),
    )
  }

  function updateSpecRow(
    groupKey: string,
    rowId: string,
    patch: Partial<Pick<SpecRow, "dynamicspecificationId" | "value" | "notes">>,
  ) {
    setGroups((prev) =>
      prev.map((g) =>
        g.key === groupKey
          ? {
              ...g,
              specs: g.specs.map((r) => (r.id === rowId ? { ...r, ...patch } : r)),
            }
          : g,
      ),
    )
  }

  function specUnit(specId?: string) {
    const s = allChildSpec.find((d) => d.id === specId)
    return s?.unit ?? ""
  }

  function validate(): string[] {
    const errors: string[] = []
    if (!groups.length) errors.push("At least one specification parent group is required.")
    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      if(g){
        if (!g.dynamicspecificationParentId) {
          errors.push(`Group ${i + 1}: Dynamic Specification Parent is required.`)
        }
        if (!g.specs.length) {
          errors.push(`Group ${i + 1}: Add at least one Dynamic Specification.`)
        }
        g.specs.forEach((r, j) => {
          if (!r.dynamicspecificationId) errors.push(`Group ${i + 1}, Spec ${j + 1}: Specification is required.`)
          if (!r.value) errors.push(`Group ${i + 1}, Spec ${j + 1}: Value is required.`)
        })
      }
    }
    return errors
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const errors = validate()
    if (errors.length) {
      toast.error(`Please fix the following:\n- ${errors.join("\n- ")}`);
      // alert(`Please fix the following:\n- ${errors.join("\n- ")}`)
      return
    }

    // Flatten groups into connector payloads (one per spec row)
    const payloads = groups.flatMap((g) =>
      g.specs.map((r) => ({
        dynamicspecificationParentId: g.dynamicspecificationParentId,
        dynamicspecificationSubParentId: g.dynamicspecificationSubParentId && g.dynamicspecificationSubParentId != '-' && g.dynamicspecificationSubParentId != '' ? g.dynamicspecificationSubParentId : null, // optional single sub-parent per group
        dynamicspecificationId: r.dynamicspecificationId,
        value: r.value,
        notes: r.notes,
      })),
    )
    try {
      // setLoading(true);

      // let response: AxiosResponse;
      // if (payloads) {
      let  response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/${params.productId}/dynamicspec`, payloads);
      // } else {
      //   response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/dynamicspec`, payloads);
      // }
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
      // setLoading(false);
    }
    
  }

  function resetForm() {
    setGroups([newParentGroup()])
  }

  return (
      loading ? 
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader/>
      </div> 
      :
      <>
        <div className="flex items-center justify-between">
          <Heading title={title} description={description} />
        </div>
        <Separator />
        <form onSubmit={onSubmit} className="space-y-8">
            <Button
              type="button"
              onClick={addGroup}
              className="bg-green-500 text-primary-foreground hover:opacity-90 hover:bg-green-600 gap-2"
              aria-label="Add another parent group"
            >
              <CirclePlus width={20} height={20} />Add Parent Group
            </Button>
          {/* Parent Groups */}
          <div className="space-y-6">
            {groups.map((group, groupIndex) => (
              <section
                key={group.key}
                className="rounded-lg border-4 p-4 border-black bg-background shadow-lg"
                aria-labelledby={`group-title-${group.key}`}
              >
                <div className="pb-4 font-bold text-2xl">Group {groupIndex + 1}</div>
                <div className="grid grid-cols-12 gap-4 pb-8">
                  <div className="grid gap-2 col-span-5">
                    <label htmlFor={`parent-${group.key}`} className="text-sm font-medium">
                      Specification Parent{" "}
                      <span className="text-destructive" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <Select
                      name={`parent-${group.key}`}
                      value={group.dynamicspecificationParentId}
                      onValueChange={(val) => 
                        updateGroup(group.key, "dynamicspecificationParentId", val)
                      }
                    >
                      <SelectTrigger
                        id={`parent-${group.key}`}
                        aria-required="true"
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                      <SelectValue placeholder="Select a parent specification" />
                      </SelectTrigger>
                        <SelectContent className="max-h-[300px] overflow-y-scroll">
                        {allParentSpec.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            {p.name}
                          </SelectItem>
                        ))}
                        </SelectContent>
                      </Select>
                  </div>
                  <div className="grid gap-2 col-span-5">
                    <label htmlFor={`subparent-${group.key}`} className="text-sm font-medium">
                      Specification Sub-Parent (optional)
                    </label>
                    <Select
                      name={`subparent-${group.key}`}
                      value={group.dynamicspecificationSubParentId ?? "-"}
                      onValueChange={(val) => 
                        updateGroup(group.key, "dynamicspecificationSubParentId", val)
                      }
                    >
                      <SelectTrigger
                        id={`subparent-${group.key}`}
                        aria-required="true"
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                      <SelectValue placeholder="Select a sub parent specification" />
                      </SelectTrigger>
                        <SelectContent className="max-h-[300px] overflow-y-scroll">
                          <SelectItem value={'-'}>
                            -
                          </SelectItem>
                        {allSubParentSpec.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            {p.name}
                          </SelectItem>
                        ))}
                        </SelectContent>
                      </Select>
                  </div>
                  <div className="grid gap-2 col-span-2">
                    <label htmlFor={`subparent-${group.key}`} className="text-sm font-medium">
                      Delete All?
                    </label>
                    <Button
                      variant={"destructive"}
                      onClick={() => removeGroup(group.key)}
                      aria-label={`Remove Parent Group ${groupIndex + 1}`}
                    >
                      <Trash width={20} height={20} />
                    </Button>
                  </div>
                </div>

                {/* Specs list for this group */}
                <div className="space-y-4 rounded-md p-4 border-black border-2">
                  <div className="flex items-center justify-start">
                    <div
                      onClick={() => addSpecRowToGroup(group.key)}
                      className="flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors p-2 rounded-lg hover:cursor-pointer justify-center items-center"
                    >
                      <CirclePlus width={20} height={20} />Add Specification
                    </div>
                  </div>

                  {group.specs.map((row, rowIndex) => {
                    const unit = specUnit(row.dynamicspecificationId)
                    return (
                      <div key={row.id} className="">
                        <div className="grid gap-3 md:grid-cols-12">
                          <div className="grid gap-2 col-span-3">
                            <div className="flex gap-2 items-center">
                            {rowIndex + 1}.
                            <Select
                              value={row.dynamicspecificationId ? String(row.dynamicspecificationId) : ""}
                              onValueChange={(val) =>
                                updateSpecRow(group.key, row.id, { dynamicspecificationId: val })
                              }
                              name={`spec-${group.key}-${row.id}`}
                            >
                              <SelectTrigger
                                id={`spec-${group.key}-${row.id}`}
                                aria-required="true"
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                <SelectValue placeholder="Select a specification" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px] overflow-y-scroll">
                                {allChildSpec.map((ds) => (
                                  <SelectItem key={ds.id} value={String(ds.id)}>
                                    {ds.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            </div>
                          </div>
                          <div className="grid gap-2 col-span-3">
                            <Input
                              id={`value-${group.key}-${row.id}`}
                              required
                              value={row.value}
                              onChange={(e) => updateSpecRow(group.key, row.id, { value: e.target.value })}
                              placeholder="Value"
                              className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                          </div>
                          <div className="grid gap-2 col-span-1 justify-start items-center">
                            <div className="text-sm font-medium">
                              {unit && unit}
                            </div>
                          </div>
                          <div className="grid gap-2 col-span-4">
                            <Input
                              id={`notes-${group.key}-${row.id}`}
                              value={row.notes}
                              onChange={(e) => updateSpecRow(group.key, row.id, { notes: e.target.value })}
                              placeholder="Notes (optional)"
                              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                          </div>
                          <div className="grid gap-2 col-span-1">
                            <Button
                              variant={"destructive"}
                              onClick={() => removeSpecRowFromGroup(group.key, row.id)}
                              aria-label={`Remove specification ${rowIndex + 1}`}
                            >
                              <Trash width={20} height={20} />
                            </Button>
                          </div>
                        </div>


                        
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>

          <div className="flex items-center justify-between">
      

            <div className="flex items-center gap-3 w-full">
              <Button type="submit" className="w-screen bg-green-500 text-primary-foreground hover:opacity-90 hover:bg-green-600">
                {action}
              </Button>
            </div>
          </div>
        </form>
      </>
  )
}
