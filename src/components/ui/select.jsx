"use client";

import * as React from "react";
import {
  Select as RadixSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import PropTypes from "prop-types";

/**
 * A clean wrapper for Radix Select used throughout forms.
 *
 * @param {string} value - Current selected value
 * @param {function} onValueChange - Handler for value changes
 * @param {Array<{ id: string, label: string }>} options - Select dropdown options
 * @param {string} placeholder - Placeholder text when nothing selected
 * @param {string} label - Optional label shown at top of dropdown
 * @param {string} className - Custom styles
 */
export function Select({
  value,
  onValueChange,
  options = [],
  placeholder = "Select...",
  label,
  className = "",
}) {
  // 🧠 Prevent Radix error: must not have empty string values
  const safeOptions = options
    .filter((opt) => opt && opt.id && opt.label)
    .map((opt) => ({
      id: String(opt.id),
      label: opt.label,
    }));

  return (
    <RadixSelect value={value || ""} onValueChange={onValueChange}>
      <SelectTrigger
        className={`w-full border rounded-md px-3 py-2 flex justify-between items-center focus:ring-2 focus:ring-primary focus:outline-none ${className}`}
      >
        <SelectValue placeholder={placeholder} />
        <ChevronDown className="w-4 h-4 opacity-70" />
      </SelectTrigger>

      <SelectContent className="bg-white border rounded-md shadow-lg z-50">
        <SelectViewport>
          <SelectGroup>
            {label && (
              <SelectLabel className="px-3 py-1 text-sm font-semibold text-gray-500">
                {label}
              </SelectLabel>
            )}

            {safeOptions.length > 0 ? (
              safeOptions.map((opt) => (
                <SelectItem
                  key={opt.id}
                  value={opt.id}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-md focus:bg-gray-100"
                >
                  {opt.label}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value="no-options">
                No options available
              </SelectItem>
            )}
          </SelectGroup>
        </SelectViewport>
      </SelectContent>
    </RadixSelect>
  );
}

Select.propTypes = {
  value: PropTypes.string,
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
};

export default Select;
