import { AllFilterProductsOnlyType, CheckBoxData, ChildSpecificationProp, SliderData } from '@/app/(frontend)/types';
import AllDriversandFiltersProducts from '../components-all-drivers-page/all-filters';
import { getAllProductsForFilterPage } from '@/app/(frontend)/actions/get-all-products-for-filter-page';

function removeDuplicates<RangeSliderFilter>(arr: RangeSliderFilter[]): RangeSliderFilter[] {
  return Array.from(new Set(arr));
}

export default async function SearchDriversKitsPage() {
    const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "url": `${baseUrl}/search`,
        "name": "SB Acoustics",
        "description": "Search Your Drivers and Kits!",
    };
    

    let [tempData, allSpecsCombined]: [AllFilterProductsOnlyType[], Record<string, ChildSpecificationProp[]>] = await getAllProductsForFilterPage(process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID, 'search', null, null);

    let sliderRows: SliderData[] = [];
    let checkboxRows: CheckBoxData[] = [];

    let counterShow = 0;

    for (const key in allSpecsCombined) {
        if(allSpecsCombined[key]) {
        if(key !== 'impedance' && key !== 'program-power'){ 
            if(key !== 'dome-material' && key !== 'nominal-impedance' && key !== 'cone-material') {
            const allValueWithoutDuplicates: number[] = removeDuplicates(allSpecsCombined[key].map((val) => Number(val.value)));
            const allValueWithoutDuplicatesAndNone = allValueWithoutDuplicates.filter(number => !Number.isNaN(number));
            const sortedValues = allValueWithoutDuplicatesAndNone.slice().sort((a, b) => a - b);
            if(sortedValues.length>1){
                counterShow+=1
            }
            sliderRows.push(
                {
                  name: allSpecsCombined[key][0]?.childname ?? '', 
                  value: sortedValues, 
                  unit: allSpecsCombined[key][0]?.unit ?? '',
                  max_index: sortedValues.length - 1,
                  min_index: 0,
                  minIndex: 0,
                  maxIndex: sortedValues.length - 1,
                  slug: key
                },
            )
            }
            else{
            const allValueWithoutDuplicates: string[] = removeDuplicates(allSpecsCombined[key].map((val) => val.value));
            const allValueWithoutDuplicatesAndNone = allValueWithoutDuplicates.filter(number => number != '');
            let sortedValues = []
            if(key === 'nominal-impedance') {
                sortedValues = allValueWithoutDuplicatesAndNone.slice().sort((a, b) => Number(a) - Number(b));
            }
            else {
                sortedValues = allValueWithoutDuplicatesAndNone.sort()
            }
            if(sortedValues.length>1){
                counterShow+=1
            }
            checkboxRows.push(
                {
                    name: allSpecsCombined[key][0]?.childname ?? '', 
                    value: sortedValues, 
                    unit: allSpecsCombined[key][0]?.unit ?? '',
                    slug: key,
                },
            )
            }
        }
        }
    }

  return( 
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <h1 className='sr-only'>Search Drivers and Kits</h1>
      
      {tempData &&
        <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4">
            <div className="md:grid lg:grid-cols-5 md:grid-cols-4">
                <AllDriversandFiltersProducts data={tempData} slider={sliderRows} checkbox={checkboxRows} showFilters={counterShow!==0}/>
            </div>
        </div>
      }
    </>
  );
}

