"use client"

import { cn } from "@/lib/utils"

export type KitchenLayoutType = "l-shaped" | "u-shaped" | "galley" | "island" | "single-wall"

interface KitchenFloorPlanProps {
  width: number
  depth: number
  layout: KitchenLayoutType
  className?: string
}

const SCALE = 25 // pixels per foot
const CABINET_DEPTH = 2 // feet
const MARGIN = 60 // margin for dimensions

export function KitchenFloorPlan({ width, depth, layout, className }: KitchenFloorPlanProps) {
  const roomWidth = width * SCALE
  const roomHeight = depth * SCALE
  const svgWidth = roomWidth + MARGIN * 2
  const svgHeight = roomHeight + MARGIN * 2
  const cabinetDepthPx = CABINET_DEPTH * SCALE

  // Render detailed sink with basin shape
  const renderSink = (x: number, y: number, w: number, h: number, rotation = 0) => {
    const cx = x + w / 2
    const cy = y + h / 2
    return (
      <g transform={`rotate(${rotation} ${cx} ${cy})`}>
        {/* Counter cutout */}
        <rect x={x} y={y} width={w} height={h} fill="#e8e4df" stroke="#1a1a1a" strokeWidth={1.5} />
        {/* Basin */}
        <rect 
          x={x + w * 0.1} 
          y={y + h * 0.15} 
          width={w * 0.8} 
          height={h * 0.7} 
          fill="#f5f5f5" 
          stroke="#1a1a1a" 
          strokeWidth={1} 
          rx={4}
        />
        {/* Drain */}
        <circle cx={cx} cy={cy + h * 0.1} r={w * 0.08} fill="#1a1a1a" />
        {/* Faucet base */}
        <ellipse cx={cx} cy={y + h * 0.12} rx={w * 0.12} ry={h * 0.06} fill="#888" stroke="#1a1a1a" strokeWidth={0.5} />
        {/* Faucet spout */}
        <path 
          d={`M ${cx} ${y + h * 0.12} Q ${cx} ${y + h * 0.25} ${cx} ${y + h * 0.35}`}
          fill="none" 
          stroke="#888" 
          strokeWidth={3}
          strokeLinecap="round"
        />
      </g>
    )
  }

  // Render detailed stove/range with burners
  const renderStove = (x: number, y: number, w: number, h: number, rotation = 0) => {
    const cx = x + w / 2
    const cy = y + h / 2
    const burnerRadius = Math.min(w, h) * 0.15
    const burnerSpacing = 0.28
    return (
      <g transform={`rotate(${rotation} ${cx} ${cy})`}>
        {/* Stove body */}
        <rect x={x} y={y} width={w} height={h} fill="#2a2a2a" stroke="#1a1a1a" strokeWidth={1.5} rx={2} />
        {/* Cooktop surface */}
        <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} fill="#1a1a1a" stroke="#333" strokeWidth={0.5} rx={1} />
        {/* Burners - 4 burner layout */}
        {[
          [x + w * burnerSpacing, y + h * burnerSpacing],
          [x + w * (1 - burnerSpacing), y + h * burnerSpacing],
          [x + w * burnerSpacing, y + h * (1 - burnerSpacing)],
          [x + w * (1 - burnerSpacing), y + h * (1 - burnerSpacing)],
        ].map(([bx, by], i) => (
          <g key={i}>
            {/* Outer ring */}
            <circle cx={bx} cy={by} r={burnerRadius} fill="none" stroke="#555" strokeWidth={2} />
            {/* Inner ring */}
            <circle cx={bx} cy={by} r={burnerRadius * 0.6} fill="none" stroke="#444" strokeWidth={1.5} />
            {/* Center */}
            <circle cx={bx} cy={by} r={burnerRadius * 0.25} fill="#333" />
          </g>
        ))}
        {/* Control panel area */}
        <rect x={x + w * 0.1} y={y + h - 8} width={w * 0.8} height={5} fill="#333" rx={1} />
        {/* Control knobs */}
        {[0.25, 0.4, 0.6, 0.75].map((pos, i) => (
          <circle key={i} cx={x + w * pos} cy={y + h - 5.5} r={2} fill="#666" />
        ))}
      </g>
    )
  }

  // Render detailed refrigerator
  const renderFridge = (x: number, y: number, w: number, h: number, rotation = 0) => {
    const cx = x + w / 2
    const cy = y + h / 2
    return (
      <g transform={`rotate(${rotation} ${cx} ${cy})`}>
        {/* Fridge body */}
        <rect x={x} y={y} width={w} height={h} fill="#e0e0e0" stroke="#1a1a1a" strokeWidth={1.5} rx={2} />
        {/* Freezer section (top) */}
        <rect x={x + 2} y={y + 2} width={w - 4} height={h * 0.3} fill="#d0d0d0" stroke="#aaa" strokeWidth={0.5} />
        {/* Main section */}
        <rect x={x + 2} y={y + h * 0.32} width={w - 4} height={h * 0.66} fill="#d0d0d0" stroke="#aaa" strokeWidth={0.5} />
        {/* Door handles */}
        <line x1={x + w - 6} y1={y + h * 0.08} x2={x + w - 6} y2={y + h * 0.22} stroke="#888" strokeWidth={2} strokeLinecap="round" />
        <line x1={x + w - 6} y1={y + h * 0.4} x2={x + w - 6} y2={y + h * 0.6} stroke="#888" strokeWidth={2} strokeLinecap="round" />
        {/* Vent grill at bottom */}
        <rect x={x + w * 0.2} y={y + h - 6} width={w * 0.6} height={4} fill="#333" rx={1} />
      </g>
    )
  }

  // Render dishwasher
  const renderDishwasher = (x: number, y: number, w: number, h: number) => (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#c8c8c8" stroke="#1a1a1a" strokeWidth={1.5} rx={1} />
      {/* Control panel */}
      <rect x={x + 3} y={y + 3} width={w - 6} height={8} fill="#444" rx={1} />
      {/* Handle */}
      <line x1={x + w * 0.2} y1={y + h * 0.5} x2={x + w * 0.8} y2={y + h * 0.5} stroke="#888" strokeWidth={3} strokeLinecap="round" />
    </g>
  )

  // Render cabinet with hatch pattern
  const renderCabinet = (x: number, y: number, w: number, h: number, isVertical = false) => {
    const hatchId = `hatch-${x}-${y}`
    return (
      <g>
        <defs>
          <pattern id={hatchId} patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#c9c3ba" strokeWidth="1" />
          </pattern>
        </defs>
        {/* Cabinet base */}
        <rect x={x} y={y} width={w} height={h} fill={`url(#${hatchId})`} stroke="#1a1a1a" strokeWidth={1.5} />
        {/* Counter edge highlight */}
        {isVertical ? (
          <line x1={x + w} y1={y} x2={x + w} y2={y + h} stroke="#a09585" strokeWidth={2} />
        ) : (
          <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke="#a09585" strokeWidth={2} />
        )}
      </g>
    )
  }

  // Render island with seating indicators
  const renderIsland = (x: number, y: number, w: number, h: number) => (
    <g>
      <defs>
        <pattern id="island-hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#d4cfc6" strokeWidth="1" />
        </pattern>
      </defs>
      {/* Island body */}
      <rect x={x} y={y} width={w} height={h} fill="url(#island-hatch)" stroke="#1a1a1a" strokeWidth={2} />
      {/* Counter edge */}
      <rect x={x + 2} y={y + 2} width={w - 4} height={h - 4} fill="none" stroke="#a09585" strokeWidth={1} />
      {/* Seating stools */}
      {Array.from({ length: Math.floor(w / 30) }).map((_, i) => {
        const stoolX = x + 15 + i * 30
        return (
          <g key={i}>
            <circle cx={stoolX} cy={y + h + 20} r={10} fill="none" stroke="#666" strokeWidth={1.5} strokeDasharray="3 2" />
          </g>
        )
      })}
    </g>
  )

  // Render dimension line with arrows
  const renderDimension = (x1: number, y1: number, x2: number, y2: number, label: string, offset = 0) => {
    const isHorizontal = y1 === y2
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    const midX = (x1 + x2) / 2
    const midY = (y1 + y2) / 2
    const arrowSize = 6

    return (
      <g className="dimension-line">
        {/* Extension lines */}
        {isHorizontal ? (
          <>
            <line x1={x1} y1={y1 - 8 - offset} x2={x1} y2={y1 + 5} stroke="#666" strokeWidth={0.5} />
            <line x1={x2} y1={y2 - 8 - offset} x2={x2} y2={y2 + 5} stroke="#666" strokeWidth={0.5} />
          </>
        ) : (
          <>
            <line x1={x1 - 8 - offset} y1={y1} x2={x1 + 5} y2={y1} stroke="#666" strokeWidth={0.5} />
            <line x1={x2 - 8 - offset} y1={y2} x2={x2 + 5} y2={y2} stroke="#666" strokeWidth={0.5} />
          </>
        )}
        {/* Main dimension line */}
        <line 
          x1={isHorizontal ? x1 : x1 - 5 - offset} 
          y1={isHorizontal ? y1 - 5 - offset : y1}
          x2={isHorizontal ? x2 : x2 - 5 - offset}
          y2={isHorizontal ? y2 - 5 - offset : y2}
          stroke="#666" 
          strokeWidth={1} 
        />
        {/* Arrows */}
        {isHorizontal ? (
          <>
            <polygon points={`${x1},${y1 - 5 - offset} ${x1 + arrowSize},${y1 - 5 - offset - 3} ${x1 + arrowSize},${y1 - 5 - offset + 3}`} fill="#666" />
            <polygon points={`${x2},${y2 - 5 - offset} ${x2 - arrowSize},${y2 - 5 - offset - 3} ${x2 - arrowSize},${y2 - 5 - offset + 3}`} fill="#666" />
          </>
        ) : (
          <>
            <polygon points={`${x1 - 5 - offset},${y1} ${x1 - 5 - offset - 3},${y1 + arrowSize} ${x1 - 5 - offset + 3},${y1 + arrowSize}`} fill="#666" />
            <polygon points={`${x2 - 5 - offset},${y2} ${x2 - 5 - offset - 3},${y2 - arrowSize} ${x2 - 5 - offset + 3},${y2 - arrowSize}`} fill="#666" />
          </>
        )}
        {/* Label */}
        <rect 
          x={midX - (isHorizontal ? 18 : 8)} 
          y={midY - (isHorizontal ? 16 - offset : 8)} 
          width={isHorizontal ? 36 : 16} 
          height={isHorizontal ? 14 : 16}
          fill="white"
        />
        <text 
          x={midX}
          y={isHorizontal ? midY - 5 - offset : midY + 4}
          textAnchor="middle" 
          dominantBaseline="middle"
          className="text-[11px] font-medium"
          fill="#333"
        >
          {label}
        </text>
      </g>
    )
  }

  // Render work triangle with measurements
  const renderWorkTriangle = (points: [number, number][], labels: string[]) => {
    if (points.length < 3) return null
    const pathData = `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]} L ${points[2][0]} ${points[2][1]} Z`
    
    const getMidpoint = (p1: [number, number], p2: [number, number]): [number, number] => [
      (p1[0] + p2[0]) / 2,
      (p1[1] + p2[1]) / 2
    ]

    const edges = [
      { from: points[0], to: points[1], label: labels[0] },
      { from: points[1], to: points[2], label: labels[1] },
      { from: points[2], to: points[0], label: labels[2] },
    ]

    return (
      <g>
        {/* Triangle fill */}
        <path d={pathData} fill="rgba(59, 130, 246, 0.08)" stroke="none" />
        {/* Triangle edges with dashes */}
        {edges.map((edge, i) => {
          const mid = getMidpoint(edge.from, edge.to)
          return (
            <g key={i}>
              <line 
                x1={edge.from[0]} y1={edge.from[1]}
                x2={edge.to[0]} y2={edge.to[1]}
                stroke="#3b82f6"
                strokeWidth={1.5}
                strokeDasharray="6 4"
              />
              <rect x={mid[0] - 14} y={mid[1] - 8} width={28} height={16} fill="white" rx={2} />
              <text x={mid[0]} y={mid[1] + 1} textAnchor="middle" dominantBaseline="middle" className="text-[9px]" fill="#3b82f6">
                {edge.label}
              </text>
            </g>
          )
        })}
        {/* Corner markers */}
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={4} fill="#3b82f6" />
        ))}
      </g>
    )
  }

  const calculateDistance = (p1: [number, number], p2: [number, number]): string => {
    const dist = Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2) / SCALE
    return `${dist.toFixed(1)}'`
  }

  const renderLayout = () => {
    const ox = MARGIN // offset x
    const oy = MARGIN // offset y

    switch (layout) {
      case "l-shaped": {
        const sinkPos: [number, number] = [ox + cabinetDepthPx + 40, oy + cabinetDepthPx / 2]
        const fridgePos: [number, number] = [ox + cabinetDepthPx / 2, oy + roomHeight - 60]
        const stovePos: [number, number] = [ox + roomWidth - 80, oy + cabinetDepthPx / 2]
        
        return (
          <>
            {renderCabinet(ox, oy, roomWidth, cabinetDepthPx)}
            {renderCabinet(ox, oy + cabinetDepthPx, cabinetDepthPx, roomHeight - cabinetDepthPx, true)}
            {renderSink(ox + cabinetDepthPx + 20, oy + 4, 50, cabinetDepthPx - 8)}
            {renderStove(ox + roomWidth - 100, oy + 4, 55, cabinetDepthPx - 8)}
            {renderDishwasher(ox + cabinetDepthPx + 80, oy + 4, 40, cabinetDepthPx - 8)}
            {renderFridge(ox + 4, oy + roomHeight - 80, cabinetDepthPx - 8, 70, 0)}
            {renderWorkTriangle(
              [sinkPos, stovePos, fridgePos],
              [calculateDistance(sinkPos, stovePos), calculateDistance(stovePos, fridgePos), calculateDistance(fridgePos, sinkPos)]
            )}
          </>
        )
      }

      case "u-shaped": {
        const sinkPos: [number, number] = [ox + roomWidth / 2, oy + cabinetDepthPx / 2]
        const fridgePos: [number, number] = [ox + cabinetDepthPx / 2, oy + roomHeight - cabinetDepthPx - 35]
        const stovePos: [number, number] = [ox + roomWidth - cabinetDepthPx / 2, oy + roomHeight - cabinetDepthPx - 35]
        
        return (
          <>
            {renderCabinet(ox, oy, roomWidth, cabinetDepthPx)}
            {renderCabinet(ox, oy + cabinetDepthPx, cabinetDepthPx, roomHeight - cabinetDepthPx, true)}
            {renderCabinet(ox + roomWidth - cabinetDepthPx, oy + cabinetDepthPx, cabinetDepthPx, roomHeight - cabinetDepthPx, true)}
            {renderSink(ox + roomWidth / 2 - 25, oy + 4, 50, cabinetDepthPx - 8)}
            {renderStove(ox + roomWidth - cabinetDepthPx - 60, oy + roomHeight - cabinetDepthPx - 60, 55, cabinetDepthPx - 8, 90)}
            {renderFridge(ox + 4, oy + roomHeight - cabinetDepthPx - 75, cabinetDepthPx - 8, 70)}
            {renderDishwasher(ox + roomWidth / 2 + 35, oy + 4, 40, cabinetDepthPx - 8)}
            {renderWorkTriangle(
              [sinkPos, stovePos, fridgePos],
              [calculateDistance(sinkPos, stovePos), calculateDistance(stovePos, fridgePos), calculateDistance(fridgePos, sinkPos)]
            )}
          </>
        )
      }

      case "galley": {
        const sinkPos: [number, number] = [ox + cabinetDepthPx / 2, oy + roomHeight * 0.35]
        const fridgePos: [number, number] = [ox + roomWidth - cabinetDepthPx / 2, oy + roomHeight * 0.5]
        const stovePos: [number, number] = [ox + cabinetDepthPx / 2, oy + roomHeight * 0.65]
        
        return (
          <>
            {renderCabinet(ox, oy, cabinetDepthPx, roomHeight, true)}
            {renderCabinet(ox + roomWidth - cabinetDepthPx, oy, cabinetDepthPx, roomHeight, true)}
            {renderSink(ox + 4, oy + roomHeight * 0.3, cabinetDepthPx - 8, 50, 90)}
            {renderStove(ox + 4, oy + roomHeight * 0.55, cabinetDepthPx - 8, 55, 90)}
            {renderFridge(ox + roomWidth - cabinetDepthPx + 4, oy + roomHeight * 0.4, cabinetDepthPx - 8, 70)}
            {renderDishwasher(ox + 4, oy + roomHeight * 0.45 - 20, cabinetDepthPx - 8, 35)}
            {renderWorkTriangle(
              [sinkPos, stovePos, fridgePos],
              [calculateDistance(sinkPos, stovePos), calculateDistance(stovePos, fridgePos), calculateDistance(fridgePos, sinkPos)]
            )}
          </>
        )
      }

      case "island": {
        const islandWidth = Math.min(roomWidth * 0.5, 150)
        const islandDepth = Math.min(roomHeight * 0.2, 50)
        const islandX = ox + (roomWidth - islandWidth) / 2
        const islandY = oy + roomHeight * 0.55
        
        const sinkPos: [number, number] = [ox + roomWidth / 2, oy + cabinetDepthPx / 2]
        const fridgePos: [number, number] = [ox + 35, oy + cabinetDepthPx / 2]
        const stovePos: [number, number] = [islandX + islandWidth / 2, islandY + islandDepth / 2]
        
        return (
          <>
            {renderCabinet(ox, oy, roomWidth, cabinetDepthPx)}
            {renderIsland(islandX, islandY, islandWidth, islandDepth)}
            {renderSink(ox + roomWidth / 2 - 25, oy + 4, 50, cabinetDepthPx - 8)}
            {renderStove(islandX + islandWidth / 2 - 27, islandY + 4, 55, islandDepth - 8)}
            {renderFridge(ox + 8, oy + 4, 50, cabinetDepthPx - 8)}
            {renderDishwasher(ox + roomWidth / 2 + 35, oy + 4, 40, cabinetDepthPx - 8)}
            {renderWorkTriangle(
              [sinkPos, stovePos, fridgePos],
              [calculateDistance(sinkPos, stovePos), calculateDistance(stovePos, fridgePos), calculateDistance(fridgePos, sinkPos)]
            )}
            {/* Island dimension */}
            {renderDimension(islandX, islandY + islandDepth + 35, islandX + islandWidth, islandY + islandDepth + 35, `${(islandWidth / SCALE).toFixed(1)}'`)}
          </>
        )
      }

      case "single-wall": {
        const sinkPos: [number, number] = [ox + roomWidth * 0.5, oy + cabinetDepthPx / 2]
        const fridgePos: [number, number] = [ox + roomWidth * 0.2, oy + cabinetDepthPx / 2]
        const stovePos: [number, number] = [ox + roomWidth * 0.75, oy + cabinetDepthPx / 2]
        
        return (
          <>
            {renderCabinet(ox, oy, roomWidth, cabinetDepthPx)}
            {renderFridge(ox + roomWidth * 0.08, oy + 4, 50, cabinetDepthPx - 8)}
            {renderSink(ox + roomWidth * 0.4, oy + 4, 50, cabinetDepthPx - 8)}
            {renderDishwasher(ox + roomWidth * 0.55, oy + 4, 40, cabinetDepthPx - 8)}
            {renderStove(ox + roomWidth * 0.7, oy + 4, 55, cabinetDepthPx - 8)}
            {renderWorkTriangle(
              [sinkPos, stovePos, fridgePos],
              [calculateDistance(sinkPos, stovePos), calculateDistance(stovePos, fridgePos), calculateDistance(fridgePos, sinkPos)]
            )}
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
        className="w-full h-full bg-white rounded-lg border border-border"
        style={{ maxHeight: "500px" }}
      >
        {/* Background grid */}
        <defs>
          <pattern id="grid" width={SCALE} height={SCALE} patternUnits="userSpaceOnUse">
            <path d={`M ${SCALE} 0 L 0 0 0 ${SCALE}`} fill="none" stroke="#e5e5e5" strokeWidth={0.5} />
          </pattern>
        </defs>
        <rect x={MARGIN} y={MARGIN} width={roomWidth} height={roomHeight} fill="url(#grid)" />

        {/* Room outline with thick walls */}
        <rect
          x={MARGIN}
          y={MARGIN}
          width={roomWidth}
          height={roomHeight}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={4}
        />

        {/* Room dimensions */}
        {renderDimension(MARGIN, MARGIN + roomHeight + 25, MARGIN + roomWidth, MARGIN + roomHeight + 25, `${width}' - 0"`)}
        {renderDimension(MARGIN - 25, MARGIN, MARGIN - 25, MARGIN + roomHeight, `${depth}' - 0"`)}

        {/* Layout elements */}
        {renderLayout()}

        {/* North arrow / scale indicator */}
        <g transform={`translate(${svgWidth - 50}, ${svgHeight - 40})`}>
          <rect x={-25} y={-15} width={50} height={30} fill="white" stroke="#ccc" strokeWidth={0.5} rx={2} />
          <text x={0} y={-3} textAnchor="middle" className="text-[8px]" fill="#666">SCALE</text>
          <line x1={-15} y1={7} x2={15} y2={7} stroke="#333" strokeWidth={1} />
          <line x1={-15} y1={4} x2={-15} y2={10} stroke="#333" strokeWidth={1} />
          <line x1={15} y1={4} x2={15} y2={10} stroke="#333" strokeWidth={1} />
          <text x={0} y={16} textAnchor="middle" className="text-[7px]" fill="#666">1&apos; = {SCALE}px</text>
        </g>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <svg width="28" height="20" viewBox="0 0 28 20">
            <rect x="2" y="2" width="24" height="16" fill="#e8e4df" stroke="#1a1a1a" strokeWidth="1" rx="1" />
            <rect x="5" y="5" width="18" height="10" fill="#f5f5f5" stroke="#1a1a1a" strokeWidth="0.5" rx="2" />
            <circle cx="14" cy="10" r="2" fill="#1a1a1a" />
          </svg>
          <span className="text-sm text-foreground">Sink</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="28" height="20" viewBox="0 0 28 20">
            <rect x="2" y="2" width="24" height="16" fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="1" rx="1" />
            <circle cx="9" cy="7" r="3" fill="none" stroke="#555" strokeWidth="1" />
            <circle cx="19" cy="7" r="3" fill="none" stroke="#555" strokeWidth="1" />
            <circle cx="9" cy="13" r="3" fill="none" stroke="#555" strokeWidth="1" />
            <circle cx="19" cy="13" r="3" fill="none" stroke="#555" strokeWidth="1" />
          </svg>
          <span className="text-sm text-foreground">Range/Cooktop</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="24" height="28" viewBox="0 0 24 28">
            <rect x="2" y="2" width="20" height="24" fill="#e0e0e0" stroke="#1a1a1a" strokeWidth="1" rx="1" />
            <rect x="4" y="4" width="16" height="7" fill="#d0d0d0" stroke="#aaa" strokeWidth="0.5" />
            <rect x="4" y="13" width="16" height="13" fill="#d0d0d0" stroke="#aaa" strokeWidth="0.5" />
            <line x1="18" y1="6" x2="18" y2="9" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="18" y1="16" x2="18" y2="22" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-sm text-foreground">Refrigerator</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="28" height="20" viewBox="0 0 28 20">
            <rect x="2" y="2" width="24" height="16" fill="#c8c8c8" stroke="#1a1a1a" strokeWidth="1" rx="1" />
            <rect x="4" y="4" width="20" height="4" fill="#444" rx="1" />
            <line x1="8" y1="12" x2="20" y2="12" stroke="#888" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-sm text-foreground">Dishwasher</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="28" height="16" viewBox="0 0 28 16">
            <line x1="2" y1="8" x2="26" y2="8" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx="14" cy="8" r="3" fill="#3b82f6" />
          </svg>
          <span className="text-sm text-foreground">Work Triangle</span>
        </div>
      </div>
    </div>
  )
}
