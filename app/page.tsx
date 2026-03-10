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
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-primary">
              <rect x="2" y="8" width="28" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
              <rect x="5" y="11" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="9" cy="17" r="2" stroke="currentColor" strokeWidth="1" fill="none" />
              <rect x="15" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <rect x="23" y="11" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            <h1 className="text-3xl font-serif font-semibold text-foreground tracking-tight">
              Kitchen Floor Plan Studio
            </h1>
          </div>
          <p className="text-muted-foreground">
            Professional kitchen layout visualization with architectural-style drawings and dimension annotations
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
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-serif">Architectural Floor Plan</CardTitle>
                    <CardDescription className="mt-1">
                      Room: {width}&apos;-0&quot; x {depth}&apos;-0&quot; ({area} sq ft) | Layout: {LAYOUT_OPTIONS.find((l) => l.type === activeLayout)?.name}
                    </CardDescription>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>Drawing Scale: 1&quot; = 2&apos;-0&quot;</div>
                    <div className="mt-0.5">Grid: 1&apos; x 1&apos;</div>
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

                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/40 rounded-lg border border-border/50">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 16 16" className="text-primary">
                        <polygon points="8,2 14,14 2,14" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      Work Triangle Guidelines
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1.5">
                      <li className="flex gap-2">
                        <span className="text-foreground">4&apos;-9&apos;</span>
                        <span>ideal distance per side</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-foreground">13&apos;-26&apos;</span>
                        <span>total triangle perimeter</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/40 rounded-lg border border-border/50">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 16 16" className="text-primary">
                        <rect x="2" y="2" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" rx="1" />
                        <line x1="8" y1="5" x2="8" y2="11" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      Clearance Requirements
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1.5">
                      <li className="flex gap-2">
                        <span className="text-foreground">42&quot; min</span>
                        <span>walkway clearance</span>
                      </li>
                      {activeLayout === "island" && (
                        <li className="flex gap-2">
                          <span className="text-foreground">36&quot; min</span>
                          <span>around island</span>
                        </li>
                      )}
                      <li className="flex gap-2">
                        <span className="text-foreground">48&quot; ideal</span>
                        <span>for two-cook kitchen</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
