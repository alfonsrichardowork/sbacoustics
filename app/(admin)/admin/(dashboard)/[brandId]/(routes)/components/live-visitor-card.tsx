"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type Props = {
  LiveVisitor: { year: string, month: string, date: string, users: number }[],
  counterMonth: number,
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

export function LiveVisitor(props: Props) {
  return (
    <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={props.LiveVisitor.length > 30 ? groupByMonth(props.LiveVisitor, props.counterMonth) : props.LiveVisitor}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            <XAxis dataKey="date"/>
            <YAxis dataKey="users"/>
            {/* <Tooltip
                content={({ active, payload }) => {
                if (active && payload && payload.length) {
                    return (
                    <div className="rounded-lg border bg-background p-2 shadow-xs">
                        <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Users</span>
                            <span className="font-bold text-muted-foreground">{payload[0].payload.users}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                            <span className="font-bold">{payload[0].payload.date}</span>
                        </div>
                        </div>
                    </div>
                    )
                }
                return null
                }}
            /> */}
            <Line type="monotone" dataKey="users" stroke="#ed3339" strokeWidth={2} dot={props.LiveVisitor.length > 30 ? false : true} />
            </LineChart>
        </ResponsiveContainer>
    </div>
  )
}
