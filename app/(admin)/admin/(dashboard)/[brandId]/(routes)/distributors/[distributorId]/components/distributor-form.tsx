"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { distributors } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import axios, { AxiosResponse } from "axios"
import toast from "react-hot-toast"
import { Heading } from "@/app/(admin)/admin/components/ui/heading"
import { Separator } from "@/app/(admin)/admin/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/(admin)/admin/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/app/(admin)/admin/components/ui/command"
import { cn } from "@/lib/utils"
import Link from "next/link"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  lat: z.string().min(1, "Latitude is required"),
  lng: z.string().min(1, "Longitude is required"),
  continent: z.string().optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>

interface DistributorFormProps {
  initialData: distributors | null;
};

const continents = [
  {
    label: "Asia",
  },
  {
    label: "The Americas",
  },
  {
    label: "Africa",
  },  
  {
    label: "Antartica",
  },
  {
    label: "Europe",
  },
  {
    label: "Oceania",
  },
]

export const DistributorForm: React.FC<DistributorFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(initialData?.continent)
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Distributor' : 'Create Distributor';
  const description = initialData ? 'Edit a Distributor.' : 'Add a new Distributor';
  const toastMessage = initialData ? 'Distributor updated.' : 'Distributor created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      country: "",
      phone: "",
      email: "",
      website: "",
      facebook: "",
      instagram: "",
      lat: "",
      lng: "",
      continent: "",
      address: ""
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      let response: AxiosResponse;
      data.continent = value ?? continents[0]?.label
      if (initialData) {
        response = await axios.patch(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/distributors/${params.distributorId}`, data);
      } else {
        response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${params.brandId}/distributors`, data);
      }
      if(response.data === 'duplicate'){
        toast.error("Duplicate Distributor")
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
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/distributors`);
        router.refresh();
        toast.success(toastMessage);
      }


    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg shadow-lg border w-full bg-background">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-base">Name *</FormLabel>
                    <Input placeholder="Enter distributor name" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-base">Country *</FormLabel>
                    <Input placeholder="Enter country" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="p-4 rounded-lg shadow-lg border w-full bg-background">

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-base">Phone</FormLabel>
                    <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-base">Email</FormLabel>
                    <Input type="email" placeholder="email@example.com" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-base">Website</FormLabel>
                    <Input type="url" placeholder="https://example.com" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg shadow-lg border w-full bg-background">

              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-base">Facebook</FormLabel>
                    <Input placeholder="Facebook profile URL" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-base">Instagram</FormLabel>
                    <Input placeholder="Instagram profile URL" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="p-4 rounded-lg shadow-lg border w-full bg-background">

              <div className="text-sm font-semibold">How to get lat and long value:</div>
              <div className="text-xs">1. Go to: <Link href="https://www.itilog.com/" target="blank" className="underline text-blue-500">https://www.itilog.com/</Link></div>
              <div className="text-xs">2. Copy paste the address and click "FIND GPS COORDINATES"</div>
              <div className="text-xs mb-4">3. Copy paste the lat and long value from the map to here"</div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="lat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Latitude *</FormLabel>
                      <Input placeholder="40.7128" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lng"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Longitude *</FormLabel>
                      <Input placeholder="-74.0060" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Address (Google Map URL)</FormLabel>
                      <Input placeholder="Distributor Address" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="continent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Continent *</FormLabel>
                        <div>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-[200px] justify-between"
                            >
                              {value && value!=''
                                ? continents.find((continent) => continent.label === value)?.label
                                : "Select continent..."}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search continent..." className="h-9" />
                              <CommandList>
                                <CommandEmpty>No continent found.</CommandEmpty>
                                <CommandGroup>
                                  {continents.map((continent) => (
                                    <CommandItem
                                      key={continent.label}
                                      value={continent.label}
                                      onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                      }}
                                    >
                                      {continent.label}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          value === continent.label ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        </div>
                      {/* <Input placeholder="Continent" {...field} /> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          
          <Button disabled={loading} className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
