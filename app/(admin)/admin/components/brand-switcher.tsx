"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle, SpeakerIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/app/(admin)/admin/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/app/(admin)/admin/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/(admin)/admin/components/ui/popover"
import { useParams, useRouter } from "next/navigation"
import { useBrandModal } from "@/app/(admin)/admin/hooks/use-brand-modal"
import Image from "next/image"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface BrandSwitcherProps extends PopoverTriggerProps {
  items: Record<string, any>[];
  role: string;
}

export default function BrandSwitcher({ className, items = [], role }: BrandSwitcherProps) {
  const brandModal = useBrandModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id
  }));

  const currentBrand = formattedItems.find((item) => item.value === params.brandId);
  const [open, setOpen] = React.useState(false)

  const onBrandSelect = (brand: { value: string, label: string }) => {
    setOpen(false);
    router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${brand.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a Brand"
          className={cn("w-[200px] justify-between", className)}
        >
          {/* <SpeakerIcon className="mr-2 h-4 w-4" /> */}
          {currentBrand ? 
            currentBrand.label === 'SB Acoustics' ? 
              <Image src={'/images/admin/logo_sbacoustics_black_clean.webp'} alt="Logo SB Acoustics" width={120} height={50} />
            : 
            currentBrand.label === 'SB Audience' ? 
              <Image src={'/images/admin/logo_sbaudience_black.webp'} alt="Logo SB Audience" width={120} height={50} />
            : 
            currentBrand.label === 'SB Automotive' ? 
              <Image src={'/images/admin/logo_sbautomotive_black.webp'} alt="Logo SB Automotive" width={120} height={50} />
            :
              currentBrand.label
          :
          ''}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search Brand..." />
            <CommandEmpty>No Brand found.</CommandEmpty>
            <CommandGroup heading="Brands">
              {formattedItems.map((brand) => (
                <CommandItem
                  key={brand.value}
                  onSelect={() => onBrandSelect(brand)}
                  className="text-sm"
                >
                  <SpeakerIcon className="mr-2 h-4 w-4" />
                  {brand.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentBrand?.value === brand.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            {role === 'admin'? (
              <>
              <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  brandModal.onOpen()
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Brand
              </CommandItem>
            </CommandGroup>
              </>
            ):(
              <>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
