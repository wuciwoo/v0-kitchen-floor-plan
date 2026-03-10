"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { KitchenLayoutType } from "./kitchen-floor-plan"

interface LayoutOptionCardProps {
  type: KitchenLayoutType
  name: string
  description: string
  minWidth: number
  minDepth: number
  currentWidth: number
  currentDepth: number
  isSelected: boolean
  isRecommended: boolean
  onSelect: () => void
}

export function LayoutOptionCard({
  name,
  description,
  minWidth,
  minDepth,
  currentWidth,
  currentDepth,
  isSelected,
  isRecommended,
  onSelect,
}: LayoutOptionCardProps) {
  const isDisabled = currentWidth < minWidth || currentDepth < minDepth

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200",
        isSelected && "ring-2 ring-primary shadow-md",
        isDisabled && "opacity-50 cursor-not-allowed",
        !isSelected && !isDisabled && "hover:shadow-md hover:border-primary/50"
      )}
      onClick={() => !isDisabled && onSelect()}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground">{name}</h3>
          <div className="flex gap-1">
            {isRecommended && !isDisabled && (
              <Badge variant="secondary" className="text-[10px] px-1.5">
                Best Fit
              </Badge>
            )}
            {isSelected && (
              <Badge className="text-[10px] px-1.5">Selected</Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        <div className="text-xs text-muted-foreground">
          <span className={cn(isDisabled && "text-destructive")}>
            Min: {minWidth}&apos; x {minDepth}&apos;
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
