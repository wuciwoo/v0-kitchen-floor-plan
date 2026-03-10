"use client"

import { cn } from "@/lib/utils"

export type KitchenLayoutType = "l-shaped" | "u-shaped" | "galley" | "island" | "single-wall"

interface KitchenFloorPlanProps {
  width: number
  depth: number
  layout: KitchenLayoutType
  className?: string
}

const SCALE = 20 // pixels per foot
const CABINET_DEPTH = 2 // feet
const APPLIANCE_SIZE = 2.5 // feet

export function KitchenFloorPlan({ width, depth, layout, className }: KitchenFloorPlanProps) {
  const svgWidth = width * SCALE
  const svgHeight = depth * SCALE
  const cabinetDepthPx = CABINET_DEPTH * SCALE
  const applianceSize = APPLIANCE_SIZE * SCALE

  const renderCabinet = (x: number, y: number, w: number, h: number, label?: string) => (
    <g key={`cabinet-${x}-${y}`}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        className="fill-muted stroke-border"
        strokeWidth={1}
      />
      {label && (
        <text
          x={x + w / 2}
          y={y + h / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground text-[8px] font-sans"
        >
          {label}
        </text>
      )}
    </g>
  )

  const renderAppliance = (x: number, y: number, type: "sink" | "stove" | "fridge") => {
    const colors = {
      sink: "fill-accent/20 stroke-accent",
      stove: "fill-primary/20 stroke-primary",
      fridge: "fill-secondary stroke-border",
    }
    const labels = {
      sink: "S",
      stove: "R",
      fridge: "F",
    }
    return (
      <g key={`${type}-${x}-${y}`}>
        <rect
          x={x}
          y={y}
          width={applianceSize}
          height={applianceSize}
          className={cn(colors[type])}
          strokeWidth={2}
          rx={4}
        />
        <text
          x={x + applianceSize / 2}
          y={y + applianceSize / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground text-[10px] font-medium"
        >
          {labels[type]}
        </text>
      </g>
    )
  }

  const renderWorkTriangle = (points: [number, number][]) => {
    if (points.length < 3) return null
    const pathData = `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]} L ${points[2][0]} ${points[2][1]} Z`
    return (
      <path
        d={pathData}
        className="fill-accent/5 stroke-accent/40"
        strokeWidth={1}
        strokeDasharray="4 2"
      />
    )
  }

  const renderLayout = () => {
    switch (layout) {
      case "l-shaped": {
        const trianglePoints: [number, number][] = [
          [cabinetDepthPx + applianceSize / 2, applianceSize / 2 + 10],
          [svgWidth / 2 + applianceSize / 2, cabinetDepthPx + applianceSize / 2],
          [svgWidth - cabinetDepthPx - applianceSize / 2, applianceSize / 2 + 10],
        ]
        return (
          <>
            {renderCabinet(0, 0, svgWidth, cabinetDepthPx)}
            {renderCabinet(0, cabinetDepthPx, cabinetDepthPx, svgHeight - cabinetDepthPx)}
            {renderWorkTriangle(trianglePoints)}
            {renderAppliance(cabinetDepthPx + 10, 5, "sink")}
            {renderAppliance(5, svgHeight / 2, "fridge")}
            {renderAppliance(svgWidth - cabinetDepthPx - applianceSize - 10, 5, "stove")}
          </>
        )
      }

      case "u-shaped": {
        const trianglePoints: [number, number][] = [
          [svgWidth / 2, cabinetDepthPx + applianceSize / 2],
          [cabinetDepthPx + applianceSize / 2, svgHeight - cabinetDepthPx - applianceSize / 2],
          [svgWidth - cabinetDepthPx - applianceSize / 2, svgHeight - cabinetDepthPx - applianceSize / 2],
        ]
        return (
          <>
            {renderCabinet(0, 0, svgWidth, cabinetDepthPx)}
            {renderCabinet(0, cabinetDepthPx, cabinetDepthPx, svgHeight - cabinetDepthPx)}
            {renderCabinet(svgWidth - cabinetDepthPx, cabinetDepthPx, cabinetDepthPx, svgHeight - cabinetDepthPx)}
            {renderWorkTriangle(trianglePoints)}
            {renderAppliance(svgWidth / 2 - applianceSize / 2, 5, "sink")}
            {renderAppliance(5, svgHeight - cabinetDepthPx - applianceSize - 10, "fridge")}
            {renderAppliance(svgWidth - cabinetDepthPx - applianceSize + 5, svgHeight - cabinetDepthPx - applianceSize - 10, "stove")}
          </>
        )
      }

      case "galley": {
        const trianglePoints: [number, number][] = [
          [cabinetDepthPx + applianceSize / 2, svgHeight / 3],
          [svgWidth - cabinetDepthPx - applianceSize / 2, svgHeight / 2],
          [cabinetDepthPx + applianceSize / 2, (svgHeight * 2) / 3],
        ]
        return (
          <>
            {renderCabinet(0, 0, cabinetDepthPx, svgHeight)}
            {renderCabinet(svgWidth - cabinetDepthPx, 0, cabinetDepthPx, svgHeight)}
            {renderWorkTriangle(trianglePoints)}
            {renderAppliance(5, svgHeight / 3 - applianceSize / 2, "sink")}
            {renderAppliance(5, (svgHeight * 2) / 3 - applianceSize / 2, "stove")}
            {renderAppliance(svgWidth - cabinetDepthPx - applianceSize + 5, svgHeight / 2 - applianceSize / 2, "fridge")}
          </>
        )
      }

      case "island": {
        const islandWidth = Math.min(svgWidth * 0.4, 120)
        const islandDepth = Math.min(svgHeight * 0.25, 60)
        const islandX = (svgWidth - islandWidth) / 2
        const islandY = (svgHeight - islandDepth) / 2 + 20
        const trianglePoints: [number, number][] = [
          [svgWidth / 2, islandY - 10],
          [cabinetDepthPx + applianceSize / 2, 5 + applianceSize / 2],
          [svgWidth - cabinetDepthPx - applianceSize / 2, 5 + applianceSize / 2],
        ]
        return (
          <>
            {renderCabinet(0, 0, svgWidth, cabinetDepthPx)}
            <rect
              x={islandX}
              y={islandY}
              width={islandWidth}
              height={islandDepth}
              className="fill-card stroke-border"
              strokeWidth={2}
              rx={4}
            />
            <text
              x={islandX + islandWidth / 2}
              y={islandY + islandDepth / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[10px]"
            >
              Island
            </text>
            {renderWorkTriangle(trianglePoints)}
            {renderAppliance(svgWidth / 2 - applianceSize / 2, 5, "sink")}
            {renderAppliance(cabinetDepthPx + 10, 5, "fridge")}
            {renderAppliance(svgWidth - cabinetDepthPx - applianceSize - 10, 5, "stove")}
          </>
        )
      }

      case "single-wall": {
        const trianglePoints: [number, number][] = [
          [svgWidth * 0.25, cabinetDepthPx + applianceSize / 2],
          [svgWidth * 0.5, cabinetDepthPx + applianceSize / 2],
          [svgWidth * 0.75, cabinetDepthPx + applianceSize / 2],
        ]
        return (
          <>
            {renderCabinet(0, 0, svgWidth, cabinetDepthPx)}
            {renderWorkTriangle(trianglePoints)}
            {renderAppliance(svgWidth * 0.25 - applianceSize / 2, 5, "fridge")}
            {renderAppliance(svgWidth * 0.5 - applianceSize / 2, 5, "sink")}
            {renderAppliance(svgWidth * 0.75 - applianceSize / 2, 5, "stove")}
          </>
        )
      }

      default:
        return null
    }
  }

  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full border border-border rounded-lg bg-card"
        style={{ maxHeight: "400px" }}
      >
        {/* Grid lines */}
        {Array.from({ length: Math.floor(width) + 1 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * SCALE}
            y1={0}
            x2={i * SCALE}
            y2={svgHeight}
            className="stroke-border/30"
            strokeWidth={0.5}
          />
        ))}
        {Array.from({ length: Math.floor(depth) + 1 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * SCALE}
            x2={svgWidth}
            y2={i * SCALE}
            className="stroke-border/30"
            strokeWidth={0.5}
          />
        ))}

        {/* Room outline */}
        <rect
          x={0}
          y={0}
          width={svgWidth}
          height={svgHeight}
          fill="none"
          className="stroke-foreground/20"
          strokeWidth={2}
        />

        {/* Layout elements */}
        {renderLayout()}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-accent/20 border border-accent" />
          <span>Sink</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-primary/20 border border-primary" />
          <span>Range</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-secondary border border-border" />
          <span>Fridge</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded border border-accent/40 border-dashed" />
          <span>Work Triangle</span>
        </div>
      </div>
    </div>
  )
}
