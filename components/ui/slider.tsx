"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  onValueChange?: (value: number[]) => void
  opensheetvalmin?: number
  opensheetvalmax?: number
  resetclicked?: string
  unit?: string
  dataArray?: number[]
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({className,
    onValueChange,
    opensheetvalmin = 0,
    opensheetvalmax = 0,
    resetclicked,
    unit = "",
    dataArray,
    ...props
  }, ref) => {
   // The slider works with indices, not actual values
    const currentIndices =
      props.value && Array.isArray(props.value)
        ? props.value.length >= 2
          ? props.value
          : [props.value[0] || props.min || 0, props.max || 100]
        : [props.min || 0, props.max || 100]

    // Get display values based on current slider indices and data array
    const getDisplayValues = () => {
      if (dataArray && Array.isArray(dataArray)) {
        return {
          minVal: dataArray[currentIndices[0] ?? 0] !== undefined ? dataArray[currentIndices[0] ?? 0] : currentIndices[0],
          maxVal: dataArray[currentIndices[1] ?? 0] !== undefined ? dataArray[currentIndices[1] ?? 0] : currentIndices[1],
        }
      }
      return {
        minVal: currentIndices[0],
        maxVal: currentIndices[1],
      }
    }

    const { minVal, maxVal } = getDisplayValues()
    const pathname = usePathname()

    // Handle reset by calling onValueChange with reset indices
    React.useEffect(() => {
      if (resetclicked === "true" && onValueChange) {
        const resetValue = [props.min || 0, props.max || 100]
        onValueChange(resetValue)
      }
    }, [resetclicked, props.min, props.max, onValueChange])
  return (
    <>
      <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        {...props}
        value={currentIndices}
        onValueChange={onValueChange}
      >
        <SliderPrimitive.Track className="relative h-[2px] w-full grow overflow-hidden rounded-full bg-foreground/30">
          <SliderPrimitive.Range className="absolute h-full bg-foreground" />
        </SliderPrimitive.Track>
          {currentIndices.map((_, index) => (
          <React.Fragment key={index}>
            <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full first-letter:bg-background bg-background border-2 border-primary ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50 hover:shadow-lg hover:cursor-pointer" />
          </React.Fragment>
        ))}
      </SliderPrimitive.Root>
      <div className={`w-full text-center ${pathname.includes('/sbaudience') ? 'text-background' : 'text-foreground'} text-sm`}>{unit === '"' || unit === '°' ? <>{minVal?.toString() === '' ? 0 : minVal}{unit} - {maxVal?.toString() === '' ? 0 : maxVal}{unit}</> : <>{minVal?.toString() === '' ? 0 : minVal} {unit} - {maxVal?.toString() === '' ? 0 : maxVal} {unit}</>}</div>
    </>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
