import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

export function Slider({ value, onValueChange, min = 0, max = 10000, step = 100, className = "" }) {
  return (
    <SliderPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      className={`relative flex w-full touch-none select-none items-center ${className}`}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200">
        <SliderPrimitive.Range className="absolute h-full bg-black" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-black bg-white shadow" />
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-black bg-white shadow" />
    </SliderPrimitive.Root>
  );
}

export default Slider;
