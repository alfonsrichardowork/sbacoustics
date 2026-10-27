"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Users } from "lucide-react";
import { LiveVisitor } from "./live-visitor-card";

type Props = {
  LiveVisitor: { year: string, month: string, date: string, users: number }[],
};

function groupByMonth(data: { year: string, month: string, date: string, users: number }[], counterMonth: number) {
    const result: { date: string, users: number }[] = []

    const map = new Map<string, number>()

    data.forEach(item => {
        const key = `${item.year}-${item.month}` // format: '2024-01'
        map.set(key, (map.get(key) || 0) + item.users)
    })

    for (const key of Array.from(map.keys())) {
        const users = map.get(key) || 0
        const [year, month] = key.split("-")
        if(year && month) {
            const formattedDate = new Date(+year, +month - 1).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
            })

            result.push({ date: formattedDate, users })
        }
    }

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(result.length - counterMonth, result.length)
}

export function LiveVisitorSmall(props: Props) {
    const perMonths = groupByMonth(props.LiveVisitor, 14)
    const maxMonth = perMonths.reduce((max, curr) => curr.users > max.users ? curr : max);
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
            <div className="w-full bg-background rounded-xl border hover:shadow-md min-h-36 transition duration-300 hover:cursor-pointer">
                {/* {props.loading ? (
                <div className="h-full w-full flex items-center justify-center">
                    <Skeleton className="w-full h-full rounded-md" />
                </div>
                ) : ( */}
                    <div className="md:p-4 p-2">
                        <div className="grid grid-cols-6 border-b">
                            <div className=" col-span-5 flex items-center text-start text-sm font-semibold">
                                Total Visitors
                            </div>
                            <div className="col-span-1 flex items-center justify-end">
                                <Users size={15} />
                            </div>
                        </div>
                        <div className="pt-6 font-bold text-xl">
                            {perMonths[perMonths.length-1]?.users}
                        </div>
                        <div className={`text-xs text-foreground/50 ${!perMonths[perMonths.length-2] ? "text-foreground/50" : (perMonths[perMonths.length-1]?.users ?? 0) - (perMonths[perMonths.length - 2]?.users ?? 0) >= 0 ? "text-green-500" : "text-red-500"} line-clamp-2`}>
                            {perMonths[perMonths.length-2]
                                    ? (((perMonths[perMonths.length-1]?.users ?? 0) - (perMonths[perMonths.length - 2]?.users ?? 0)) / (perMonths[perMonths.length - 2]?.users ?? 1) * 100).toFixed(1)
                                    : "0"}
                                % from last month
                        </div>
                    </div>
                {/* )} */}
            </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex gap-1.5 items-center"><Calendar size={15} className="text-primary"/>Monthly Visits Since Last Year</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            <div className="grid md:grid-cols-3 grid-cols-1 min-h-28 gap-2 mb-4">
                <div className="col-span-1 bg-red-500/10 rounded-xl text-red-500 p-3">
                    <div className="text-xs font-semibold">Total Growth</div>
                    <div className={`text-lg font-bold ${!perMonths[1] ? "text-foreground/50" : ((perMonths[perMonths.length-1]?.users ?? 0) - perMonths[1].users) >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {perMonths[1]
                            ? ((((perMonths[perMonths.length-1]?.users ?? 0) - perMonths[1].users) / perMonths[1].users) * 100).toFixed(1)
                            : "0"}
                        %
                    </div>
                    <div className="text-[11px]">
                        From {perMonths[1]?.date.split(' ')[0]?.slice(0,3)} {perMonths[1]?.date.split(' ')[1]} to {perMonths[perMonths.length - 1]?.date.split(' ')[0]?.slice(0,3)} {perMonths[perMonths.length - 1]?.date.split(' ')[1]}
                    </div>
                </div>
                <div className="col-span-1 bg-green-500/10 rounded-xl text-green-500 p-3">
                    <div className="text-xs font-semibold">Best Month</div>
                    <div className={`text-lg font-bold`}>
                        {maxMonth.date.split(' ')[0]?.slice(0,3)} {maxMonth.date.split(' ')[1]}
                    </div>
                    <div className="text-[11px]">
                        {maxMonth.users} visitors
                    </div>
                </div>
                <div className="col-span-1 bg-blue-500/10 rounded-xl text-blue-500 p-3">
                    <div className="text-xs font-semibold">Average Monthly</div>
                    <div className={`text-lg font-bold`}>
                        {(perMonths.slice(1) .reduce((sum, m) => sum + m.users, 0)/13).toFixed(0)}
                    </div>
                    <div className="text-[11px]">
                        over 13 months
                    </div>
                </div>
            </div>
            {perMonths.map((val, index) => 
            index !=0 &&
                <div key={index} className="bg-foreground/5 rounded-xl grid grid-cols-2 min-h-14 px-4 my-2">
                    <div className="col-span-1 flex justify-start items-center font-semibold">
                        {val.date.split(' ')[0]?.slice(0,3)} {val.date.split(' ')[1]}
                    </div>
                    <div className="col-span-1 flex justify-end items-center font-semibold">
                        <div>
                            <div className="font-semibold text-sm">
                                {val.users}
                            </div>
                            <div className={`flex font-medium justify-end text-[11px] ${!perMonths[index - 1] ? "text-foreground/50" : (val.users - (perMonths[index - 1]?.users ?? 0)) >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {perMonths[index - 1]
                                    ? (((val.users - (perMonths[index - 1]?.users ?? 0)) / (perMonths[index - 1]?.users ?? 1)) * 100).toFixed(1)
                                    : "0"}
                                %
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="mt-4">
                <div className="font-bold mb-2">Monthly Trend Visualization</div>
                <LiveVisitor LiveVisitor={props.LiveVisitor} counterMonth={13}/>
            </div>
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
