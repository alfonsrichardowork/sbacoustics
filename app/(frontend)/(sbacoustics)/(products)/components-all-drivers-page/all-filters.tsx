"use client";

import { activeCheckbox, activeSlider, AllFilterProductsOnlyType, CheckBoxData, SliderData } from "@/app/(frontend)/types";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import AllDriversProducts from "./all-product";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type SliderSheetValue = {
    slug: string;
    value: {
      min: number;
      max: number;
    };
};

interface MainProps {
  data: (AllFilterProductsOnlyType)[];
  slider: (SliderData)[]
  checkbox: (CheckBoxData)[]
  showFilters: (boolean)
};

const AllDriversandFiltersProducts: React.FC<MainProps> = ({
  data, slider, checkbox, showFilters
}) => {
    const [allActiveSlider, setAllActiveSlider] = useState<activeSlider[]>([])  
    const [allActiveCheckbox, setAllActiveCheckbox] = useState<activeCheckbox[]>([])  
    const [defaultSliderSheet, setdefaultSliderSheet] = useState<SliderSheetValue[]>([])  
    const [sheetOpenedForSlider, setSheetOpenedForSlider] = useState<boolean>(false)  
    const [reseted, setReseted] = useState<string>('false')
    
    const [sliderValue, setSliderValue] = useState<SliderData[]>([])
    const [loadingSlider, setLoadingSlider] = useState<boolean>(true)

    useEffect(() => {
        const fetchDataSlider = async () => {
            try {
                let tempSlider: SliderData[] = []
                slider.map((value) => {
                    tempSlider.push({
                        slug: value.slug,
                        name: value.name,
                        minIndex: value.minIndex,
                        maxIndex: value.maxIndex,
                        min_index: value.min_index,
                        max_index: value.max_index,
                        unit: value.unit,
                        value: value.value
                    })
                });
                
                setSliderValue(tempSlider)
                setLoadingSlider(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchDataSlider();
    }, [slider.length > 0]);

    useEffect(() => {
        if (reseted === 'true') {
            setAllActiveCheckbox([]);
            setAllActiveSlider([]);
          
            let tempslider = sliderValue
            tempslider.map((value) => {
                value.minIndex = value.min_index
                value.maxIndex = value.max_index
            })
            setSliderValue(tempslider)

            setReseted('false');
        }
    }, [reseted]);

   const handleSliderChange = (slug: string, value: number[], min_index: number, max_index: number, allVal: number[], parentName: string, unit: string, index: number) => {
        // setSliderValue((prev) => ({
        // ...prev,
        // minIndex: value[0],
        // maxIndex: value[1],
        // }))
        let tempslider = sliderValue
        if (tempslider[index] && value[0] !== undefined && value[1] !== undefined) {
            tempslider[index].minIndex = value[0]
            tempslider[index].maxIndex = value[1]
            setSliderValue(tempslider)
        }

        let tempactiveSlider : activeSlider[] = []
        let sliderisActive : boolean = false
        if(allActiveSlider.length!= 0){
          allActiveSlider.map((valueactiveSlider) => {
            if(valueactiveSlider.slug === slug){
                sliderisActive = true
                if(value[0] === min_index && value[1] === max_index){

                }
                else if(value[0] !== min_index || value[1] !== max_index){
                    tempactiveSlider.push({
                    slug,
                    bottomVal: value[0] ?? 0,
                    topVal: value[1] ?? 0,
                    bottomRealVal: allVal[value[0] ?? 0] ?? 0,
                    topRealVal: allVal[value[1] ?? 0] ?? 0,
                    parentName,
                    unit
                    })
                }
            }
            else{
              tempactiveSlider.push(valueactiveSlider)
            }
          })
        }
        else{
            sliderisActive = true
            if(value[0] !== min_index || value[1] !== max_index){
                tempactiveSlider.push({
                slug,
                bottomVal: value[0] ?? 0,
                topVal: value[1] ?? 0,
                bottomRealVal: allVal[value[0] ?? 0] ?? 0,
                topRealVal: allVal[value[1] ?? 0] ?? 0,
                parentName,
                unit
                })
            }
        }
        if(!sliderisActive){
            tempactiveSlider.push({
                slug,
                bottomVal: value[0] ?? 0,
                topVal: value[1] ?? 0,
                bottomRealVal: allVal[value[0] ?? 0] ?? 0,
                topRealVal: allVal[value[1] ?? 0] ?? 0,
                parentName,
                unit
            })
        }
        setAllActiveSlider(tempactiveSlider)
      };


    
      const handleCheckboxChange = (slug: string, name: string, unit: string, parentName: string) => {
        if(name!==''){
            let tempactiveCheckbox: activeCheckbox[] = [...allActiveCheckbox];
            const index = tempactiveCheckbox.findIndex(item => item.name === name);
        
            if (index !== -1) {
                tempactiveCheckbox.splice(index, 1);
            } else {
                let temp: activeCheckbox = {
                    slug,
                    name,
                    unit,
                    parentName
                };
                tempactiveCheckbox.push(temp);
            }
        
            setAllActiveCheckbox(tempactiveCheckbox);
        }
    };
    
    useEffect(() => {
        const fetchData = () => {
          try {
            let sliderTemp: SliderSheetValue[] = []
            allActiveSlider.map((value, index) => {
                sliderTemp.push({
                    slug: value.slug,
                    value:{
                        min: value.bottomVal,
                        max: value.topVal
                    }
                })
            })
            setdefaultSliderSheet(sliderTemp)
            setSheetOpenedForSlider(false)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, [sheetOpenedForSlider, allActiveSlider]); 
    
    return ( 
        <>
            {showFilters?
            
                !loadingSlider && Array.isArray(sliderValue) &&
                <div key={'1'} className="hidden md:block pr-4">
                    {/* <div className="pt-28"></div> */}
                    <div className="sticky top-24 rounded-md text-black shadow-2xl bg-zinc-100">
                    <div className="text-lg lg:text-xl font-bold text-center bg-zinc-700 text-white py-2 rounded-t-md">
                        FILTERS
                    </div>
                    <div className="p-4 overflow-auto max-h-[calc(100dvh-12rem)]">
                        {checkbox.map((valueCheckbox, index) =>
                        valueCheckbox.value.length > 1 && (
                            <div key={index} className="grid gap-2 w-full max-w-80 pt-2">
                            <div className="text-center font-bold text-sm">{valueCheckbox.name}</div>
                            {valueCheckbox.value.map((choicesVal, indexChoices) => (
                             <div key={indexChoices} className="flex items-center">
                             <div className="pr-2 py-1 flex items-center h-full">
                               <Checkbox
                                 id={choicesVal}
                                 checked={allActiveCheckbox.some((item) => item.name === choicesVal)}
                                 onClick={() =>
                                   handleCheckboxChange(
                                     valueCheckbox.slug,
                                     choicesVal,
                                     valueCheckbox.unit,
                                     valueCheckbox.name
                                   )
                                 }
                               />
                             </div>
                             <label htmlFor={choicesVal} className="text-start text-sm">
                               {choicesVal} {valueCheckbox.unit}
                             </label>
                           </div>
                           
                            ))}
                            <hr />
                            </div>
                        )
                        )}
                        {sliderValue.map((sliderValue1, index)=> 
                            sliderValue1.value.length > 1 &&
                            <div key={index} className="grid gap-2 w-full max-w-80 pt-2">
                                <div className="text-center font-bold text-sm">
                                    {sliderValue1.name}
                                </div>
                                <Slider
                                    value={[sliderValue1.minIndex, sliderValue1.maxIndex]}
                                    max={sliderValue1.max_index}
                                    min={sliderValue1.min_index}
                                    step={1}
                                    onValueChange={(val) => {
                                    handleSliderChange(sliderValue1.slug, val, sliderValue1.min_index, sliderValue1.max_index, sliderValue1.value, sliderValue1.name, sliderValue1.unit, index)
                                    }}
                                    unit={sliderValue1.unit}
                                    dataArray={sliderValue1.value}
                                    className={cn("w-full py-2")}
                                />
                                <hr/>
                            </div>
                        )}
                        <div className="pt-2 w-full flex justify-center">
                            <Button onClick={() => setReseted('true')}>
                                RESET
                            </Button>
                        </div>
                    </div>
                </div>
                </div>
            :
                // <div className="hidden md:block pr-16"></div>
                <></>
            }
            <div className='block md:hidden text-center pb-4'>
                <div className='pb-4'>
                <Sheet>
                    <SheetTrigger asChild className="hover:cursor-pointer">
                    <div className="w-full text-center font-bold text-lg bg-primary p-1 rounded-lg text-background">
                        Show All Filters
                    </div>
                    </SheetTrigger>
                    <SheetContent side={'left'} className="w-full max-w-[300px] sm:max-w-[300px]">
                    <SheetTitle/>
                    <SheetDescription/>
                    <SheetHeader>
                        <div className="text-lg lg:text-xl font-bold text-center pb-4">
                        FILTERS 
                        </div>
                    </SheetHeader>
                    {!loadingSlider && Array.isArray(sliderValue) &&
                        <ScrollArea className="h-full w-full pb-8 px-2">
                        {checkbox.map((valueCheckbox, index) =>
                        valueCheckbox.value.length > 1 && (
                            <div key={index} className="grid gap-2 w-full pt-2">
                            <div className="text-center font-bold text-sm">{valueCheckbox.name}</div>
                            {valueCheckbox.value.map((choicesVal, indexChoices) => (
                                <div key={indexChoices} className="flex items-center">
                                <div className="pr-2 py-1 flex items-center h-full">
                                    <Checkbox
                                    id={choicesVal}
                                    checked={allActiveCheckbox.some((item) => item.name === choicesVal)}
                                    onClick={() => handleCheckboxChange(valueCheckbox.slug, choicesVal, valueCheckbox.unit, valueCheckbox.name)}
                                    />
                                </div>
                                <label htmlFor={choicesVal} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {choicesVal} {valueCheckbox.unit}
                                </label>
                                </div>
                            ))}
                            <hr />
                            </div>
                        )
                        )}
                        {sliderValue.map((sliderValue1, index)=> 
                            sliderValue1.value.length > 1 &&
                            <div key={index} className="grid gap-2 w-full pt-2">
                                <div className="text-center font-bold text-sm">
                                    {sliderValue1.name}
                                </div>
                                <Slider
                                    value={[sliderValue1.minIndex, sliderValue1.maxIndex]}
                                    max={sliderValue1.max_index}
                                    min={sliderValue1.min_index}
                                    step={1}
                                    onValueChange={(val) => {
                                    handleSliderChange(sliderValue1.slug, val, sliderValue1.min_index, sliderValue1.max_index, sliderValue1.value, sliderValue1.name, sliderValue1.unit, index)
                                    }}
                                    unit={sliderValue1.unit}
                                    dataArray={sliderValue1.value}
                                    className={cn("w-full py-2")}
                                />
                                <hr/>
                            </div>
                        )}
                    <SheetFooter>
                    <div className="flex justify-center py-4 w-full">
                        {/* <div className="w-" > */}
                            <Button onClick={() => setReseted('true')} className="items-center">
                                RESET
                            </Button>
                        {/* </div> */}
                    </div>
                    </SheetFooter>
                    </ScrollArea>
                    }
                    </SheetContent>
                </Sheet>
                </div>
              
            </div>
            <AllDriversProducts allActiveSliderVal={allActiveSlider} allActiveCheckboxVal={allActiveCheckbox} products={data}/>
        </>
    );
};

export default AllDriversandFiltersProducts;
