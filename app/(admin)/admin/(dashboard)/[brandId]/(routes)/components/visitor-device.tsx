"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

type Props = {
  LiveVisitor: { device: string, users: number }[]
};

export function VisitorDevice(props: Props) {
  return (
        <div className="h-[312px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={props.LiveVisitor}
              dataKey="users"
              nameKey="device"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {props.LiveVisitor.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    [
                      '#ed3339', // red
                      '#FFA033', // orange
                      '#A30000', // dark red
                      '#E38A8A', 
                      '#BD8839',
                      '#9E5F00', 
                    ][index % 6]
                  }
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
         </div>
  )
}
