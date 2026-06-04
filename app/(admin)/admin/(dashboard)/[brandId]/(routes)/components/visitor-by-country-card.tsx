"use client"

import { CardContent } from "@/app/(admin)/admin/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type Props = {
  LiveVisitor: { country: string, users: number }[],
};

export function CountryVisitor(props: Props) {
  return (
        <CardContent className="px-4 pb-4 h-[300px] overflow-auto">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={props.LiveVisitor}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="country" />
            <YAxis dataKey="users"/>
            <Tooltip />
            <Bar dataKey="users" fill="#ed3339" />
            {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
            </BarChart>
        </ResponsiveContainer>
         </CardContent>
  )
}
