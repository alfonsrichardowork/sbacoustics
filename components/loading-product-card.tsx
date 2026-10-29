import { Loader2 } from "lucide-react";
import ProductCard from "../app/(frontend)/(sbacoustics)/(products)/components-all-drivers-page/product-card";

export function DriversPageFallback() {
    return (
            <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4">
                <div className="md:grid lg:grid-cols-5 md:grid-cols-4">
                    <div className="h-screen grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-8">
                        {Array.from({ length: 12 }).map((_, index) => (
                            <div key={index} className="px-2 pt-4">
                                <ProductCard data={null} hovered={false}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    );
  }


export function AllDriversPageFallback() {
  return(
    // <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4"> 
    //   <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        Array.from({ length: 8 }, (_, index) => index + 1).map((i) => {
            return (
              <div key={i}>
                <div className=" group cursor-pointer space-y-4 block">
                  <div className="relative aspect-square">
                    <Loader2 />
                  </div>
                  
                  <h2 className="font-bold text-xl text-center">...</h2>
                </div>
              </div>
          );
        })
    //   </div>
    // </div>
  )
}