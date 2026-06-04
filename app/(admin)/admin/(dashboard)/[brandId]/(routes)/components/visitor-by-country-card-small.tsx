"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Dot, Eye, Globe } from "lucide-react";

type Props = {
  LiveVisitor: { country: string, users: number }[],
};

export function VisitorByCountrySmall(props: Props) {
  const totalExceptFirst = props.LiveVisitor
  .reduce((sum, m) => sum + m.users, 0);
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
            <div className="w-full bg-background rounded-xl border hover:shadow-md min-h-36 transition duration-300 hover:cursor-pointer">
                <div className="md:p-4 p-2">
                    <div className="grid grid-cols-6 border-b">
                        <div className="col-span-5 flex items-center text-start text-sm font-semibold">
                            Top Country
                        </div>
                        <div className="col-span-1 flex items-center justify-end">
                            <Globe size={15} />
                        </div>
                    </div>
                    <div className="pt-6 font-bold text-xl">
                        {props.LiveVisitor[0]?.country}
                    </div>
                    <div className="text-xs text-foreground/50 flex items-center whitespace-nowrap line-clamp-2">
                        {props.LiveVisitor[0]?.users} visitors <Dot size={20} /> Click to see top 5
                    </div>
                </div>
            </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex gap-1.5 items-center"><Globe size={15} className="text-primary"/>Top 5 Countries by Visitors (30 Days)</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {props.LiveVisitor.map((val, index) => 
                <div key={index} className="bg-foreground/5 rounded-xl grid grid-cols-2 min-h-14 px-4 my-2">
                    <div className="col-span-1 flex justify-start items-center font-semibold text-sm gap-2">
                        <div className="bg-primary w-8 h-8 rounded-full text-background flex items-center justify-center">{index + 1}</div>{val.country}
                    </div>
                    <div className="col-span-1 flex justify-end items-center font-semibold text-sm">
                        <div>
                            <div className="font-semibold text-sm">
                                {val.users} visitors
                            </div>
                            <div className={`flex font-medium justify-end text-[11px] text-foreground/50`}>
                              {((val.users / totalExceptFirst) * 100).toFixed(1)}% of total visits
                            </div>
                        </div>
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
