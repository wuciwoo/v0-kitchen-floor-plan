"use client"

import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface RoomSizeInputProps {
  width: number
  depth: number
  onWidthChange: (value: number) => void
  onDepthChange: (value: number) => void
}

const PRESETS = [
  { label: "Small", width: 8, depth: 8 },
  { label: "Medium", width: 12, depth: 10 },
  { label: "Large", width: 16, depth: 12 },
  { label: "XL", width: 20, depth: 15 },
]

export function RoomSizeInput({
  width,
  depth,
  onWidthChange,
  onDepthChange,
}: RoomSizeInputProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() => {
              onWidthChange(preset.width)
              onDepthChange(preset.depth)
            }}
            className={
              width === preset.width && depth === preset.depth
                ? "border-primary bg-primary/5"
                : ""
            }
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="width" className="text-sm font-medium">
              Width
            </Label>
            <div className="flex items-center gap-1">
              <Input
                id="width"
                type="number"
                min={6}
                max={30}
                value={width}
                onChange={(e) => onWidthChange(Number(e.target.value))}
                className="w-16 h-8 text-center text-sm"
              />
              <span className="text-sm text-muted-foreground">ft</span>
            </div>
          </div>
          <Slider
            value={[width]}
            onValueChange={([value]) => onWidthChange(value)}
            min={6}
            max={30}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="depth" className="text-sm font-medium">
              Depth
            </Label>
            <div className="flex items-center gap-1">
              <Input
                id="depth"
                type="number"
                min={6}
                max={30}
                value={depth}
                onChange={(e) => onDepthChange(Number(e.target.value))}
                className="w-16 h-8 text-center text-sm"
              />
              <span className="text-sm text-muted-foreground">ft</span>
            </div>
          </div>
          <Slider
            value={[depth]}
            onValueChange={([value]) => onDepthChange(value)}
            min={6}
            max={30}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Total area:{" "}
          <span className="font-semibold text-foreground">
            {width * depth} sq ft
          </span>
        </p>
      </div>
    </div>
  )
}
