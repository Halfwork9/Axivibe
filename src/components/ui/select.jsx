import * as React from "react";
import {
  Select as RadixSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

export function Select({ value, onValueChange, options = [], placeholder = "Select...", label }) {
  return (
    <RadixSelect value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full border rounded-md px-3 py-2 flex justify-between items-center">
        <SelectValue placeholder={placeholder} />
        <ChevronDown className="w-4 h-4 opacity-60" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {label && <SelectLabel>{label}</SelectLabel>}
          {options.length > 0 ? (
            options.map((opt) => (
              <SelectItem
                key={opt.id}
                value={String(opt.id)} // ✅ must not be empty
                className="cursor-pointer hover:bg-accent px-3 py-2 rounded-md"
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
      </SelectContent>
    </RadixSelect>
  );
}
