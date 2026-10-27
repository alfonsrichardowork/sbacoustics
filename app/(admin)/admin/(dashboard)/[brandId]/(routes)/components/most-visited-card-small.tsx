"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Dot, Eye } from "lucide-react";
import Link from "next/link";

type Props = {
  pageReports: { page: string, views: number }[],
};

export function MostVisitorSmall(props: Props) {
    const topReports = props.pageReports.slice(0, 10);
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
            <div className="w-full bg-background rounded-xl border hover:shadow-md min-h-36 transition duration-300 hover:cursor-pointer">
                <div className="md:p-4 p-2">
                    <div className="grid grid-cols-6 border-b">
                        <div className="col-span-5 flex items-center text-start text-sm font-semibold">
                            Most Visited Page
                        </div>
                        <div className="col-span-1 flex items-center justify-end">
                            <Eye size={15} />
                        </div>
                    </div>
                    <div className="pt-6 font-bold text-xl">
                        {topReports[0]?.page}
                    </div>
                    <div className="text-xs text-foreground/50 flex items-center whitespace-nowrap line-clamp-2">
                        {topReports[0]?.views} page views <Dot size={20} /> Click to see popular pages
                    </div>
                </div>
            </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex gap-1.5 items-center"><Eye size={15} className="text-primary"/>Popular Products (30 Days)</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {topReports.map((val, index) => 
                <div key={index} className="bg-foreground/5 rounded-xl grid grid-cols-2 min-h-14 px-4 my-2">
                    <div className="col-span-1 flex justify-start items-center font-semibold text-sm">
                        <Link target="_blank" href={`${process.env.NEXT_PUBLIC_ROOT_URL}/${val.page}`} className="hover:text-primary">{val.page}</Link>
                    </div>
                    <div className="col-span-1 flex justify-end items-center font-semibold text-sm">
                        {val.views} views
                    </div>
                </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="destructive">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
    
  )
}
