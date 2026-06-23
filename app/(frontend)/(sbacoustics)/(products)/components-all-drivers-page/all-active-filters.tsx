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
      <div className="mb-2 flex flex-wrap justify-start gap-x-2 gap-y-1 items-center">
        <h3 className="text-sm font-bold">Active Filters:</h3>

        {slider.map((oneslider, index) => (
          <div key={index} className="text-sm text-gray-800">
            {oneslider.bottomRealVal} {oneslider.unit} - {oneslider.topRealVal}{" "}
            {oneslider.unit}
            {index !== slider.length - 1 || checkbox.length > 0 ? "," : ""}
          </div>
        ))}

        {checkbox.map((onecheckbox, index) => (
          <div key={index} className="text-sm text-gray-800">
            {onecheckbox.name} {onecheckbox.unit}
            {index !== checkbox.length - 1 ? "," : ""}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllActiveFilters
