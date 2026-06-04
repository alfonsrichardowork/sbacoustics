"use client"

import { activeCheckbox, activeSlider } from "@/app/(frontend)/types"
import type React from "react"


interface MainProps {
  slider: activeSlider[]
  checkbox: activeCheckbox[]
}

const AllActiveFilters: React.FC<MainProps> = ({ slider = [], checkbox = [] }) => {
  // Don't render if no filters are active
  if (slider.length === 0 && checkbox.length === 0) {
    return null
  }

  return (
    <div className="px-4 pt-4">
      <div className="mb-2">
        <h3 className="text-sm font-bold">Active Filters</h3>
      </div>

      <div className="bg-zinc-100 border border-gray-200 rounded-lg p-3 overflow-x-auto">
        <div className="flex gap-2 min-w-fit">
          {slider.map((oneslider, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm whitespace-nowrap shadow-sm"
            >
              <span className="font-bold text-gray-600">{oneslider.parentName}:</span>
              <span className="ml-1 text-gray-800">
                {oneslider.bottomRealVal} {oneslider.unit} - {oneslider.topRealVal} {oneslider.unit}
              </span>
            </div>
          ))}

          {checkbox.map((onecheckbox, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm whitespace-nowrap shadow-sm"
            >
              <span className="font-bold text-gray-600">{onecheckbox.parentName}:</span>
              <span className="ml-1 text-gray-800">
                {onecheckbox.name} {onecheckbox.unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllActiveFilters
