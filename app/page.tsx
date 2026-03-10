"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { KitchenFloorPlan, type KitchenLayoutType } from "@/components/kitchen-floor-plan"
import { LayoutOptionCard } from "@/components/layout-option-card"
import { RoomSizeInput } from "@/components/room-size-input"

const LAYOUT_OPTIONS: {
  type: KitchenLayoutType
  name: string
  description: string
  minWidth: number
  minDepth: number
  idealMinArea: number
}[] = [
  {
    type: "single-wall",
    name: "Single Wall",
    description: "All cabinets and appliances along one wall. Great for small spaces or open floor plans.",
    minWidth: 8,
    minDepth: 6,
    idealMinArea: 48,
  },
  {
    type: "galley",
    name: "Galley",
    description: "Two parallel walls of cabinets. Efficient workflow with everything within reach.",
    minWidth: 8,
    minDepth: 8,
    idealMinArea: 64,
  },
  {
    type: "l-shaped",
    name: "L-Shaped",
    description: "Cabinets along two perpendicular walls. Versatile and allows for dining space.",
    minWidth: 10,
    minDepth: 10,
    idealMinArea: 100,
  },
  {
    type: "u-shaped",
    name: "U-Shaped",
    description: "Three walls of cabinets. Maximum storage and counter space.",
    minWidth: 12,
    minDepth: 10,
    idealMinArea: 120,
  },
  {
    type: "island",
    name: "Island",
    description: "L-shaped with a central island. Perfect for entertaining and extra prep space.",
    minWidth: 14,
    minDepth: 12,
    idealMinArea: 168,
  },
]

export default function KitchenPlannerPage() {
  const [width, setWidth] = useState(12)
  const [depth, setDepth] = useState(10)
  const [selectedLayout, setSelectedLayout] = useState<KitchenLayoutType>("l-shaped")

  const area = width * depth

  const recommendedLayout = useMemo(() => {
    const validLayouts = LAYOUT_OPTIONS.filter(
      (layout) => width >= layout.minWidth && depth >= layout.minDepth
    )
    if (validLayouts.length === 0) return "single-wall"

    // Find the best fit based on area thresholds
    const sorted = [...validLayouts].sort(
      (a, b) => b.idealMinArea - a.idealMinArea
    )
    return sorted.find((l) => area >= l.idealMinArea)?.type || validLayouts[0].type
  }, [width, depth, area])

  // Auto-select recommended layout if current selection becomes invalid
  const currentLayoutOption = LAYOUT_OPTIONS.find((l) => l.type === selectedLayout)
  const isCurrentValid =
    currentLayoutOption &&
    width >= currentLayoutOption.minWidth &&
    depth >= currentLayoutOption.minDepth

  const activeLayout = isCurrentValid ? selectedLayout : recommendedLayout

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-serif font-semibold text-foreground">
            Kitchen Planner
          </h1>
          <p className="text-muted-foreground mt-1">
            Design your perfect kitchen layout based on your room dimensions
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left sidebar - Room size and layout options */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Room Dimensions</CardTitle>
                <CardDescription>
                  Set your kitchen room size to see available layouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RoomSizeInput
                  width={width}
                  depth={depth}
                  onWidthChange={setWidth}
                  onDepthChange={setDepth}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Layout Options</CardTitle>
                <CardDescription>
                  Choose a layout that fits your space and workflow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {LAYOUT_OPTIONS.map((layout) => (
                  <LayoutOptionCard
                    key={layout.type}
                    type={layout.type}
                    name={layout.name}
                    description={layout.description}
                    minWidth={layout.minWidth}
                    minDepth={layout.minDepth}
                    currentWidth={width}
                    currentDepth={depth}
                    isSelected={activeLayout === layout.type}
                    isRecommended={recommendedLayout === layout.type}
                    onSelect={() => setSelectedLayout(layout.type)}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main content - Floor plan visualization */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Floor Plan Preview</CardTitle>
                    <CardDescription>
                      {width}&apos; x {depth}&apos; ({area} sq ft) -{" "}
                      {LAYOUT_OPTIONS.find((l) => l.type === activeLayout)?.name} Layout
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <KitchenFloorPlan
                  width={width}
                  depth={depth}
                  layout={activeLayout}
                  className="w-full"
                />

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Layout Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • The work triangle connects sink, stove, and refrigerator
                    </li>
                    <li>
                      • Each side of the triangle should be 4-9 feet
                    </li>
                    <li>
                      • Leave at least 42&quot; clearance for walkways
                    </li>
                    {activeLayout === "island" && (
                      <li>
                        • Islands work best with at least 36&quot; clearance on all sides
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
