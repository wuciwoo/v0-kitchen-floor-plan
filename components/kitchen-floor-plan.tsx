"use client"

import { cn } from "@/lib/utils"

export type KitchenLayoutType = "l-shaped" | "u-shaped" | "galley" | "island" | "single-wall"

interface KitchenFloorPlanProps {
  width: number
  depth: number
  layout: KitchenLayoutType
  className?: string
}

// Standard cabinet sizes in inches
const STANDARD_CABINET_WIDTHS = [12, 15, 18, 21, 24, 27, 30, 33, 36, 42, 48]
const BASE_CABINET_DEPTH = 24 // inches
const WALL_CABINET_DEPTH = 12 // inches
const APPLIANCE_WIDTHS = {
  sink: 36,
  range: 30,
  fridge: 36,
  dishwasher: 24,
}

const SCALE = 2.5 // pixels per inch
const MARGIN = 80 // margin for dimensions

// Convert inches to pixels
const toPixels = (inches: number) => inches * SCALE

export function KitchenFloorPlan({ width, depth, layout, className }: KitchenFloorPlanProps) {
  const roomWidthIn = width * 12 // convert feet to inches
  const roomDepthIn = depth * 12
  const roomWidth = toPixels(roomWidthIn)
  const roomHeight = toPixels(roomDepthIn)
  const svgWidth = roomWidth + MARGIN * 2
  const svgHeight = roomHeight + MARGIN * 2
  const baseDepthPx = toPixels(BASE_CABINET_DEPTH)
  const wallDepthPx = toPixels(WALL_CABINET_DEPTH)

  // Calculate cabinet run with standard sizes
  const calculateCabinetRun = (totalWidth: number, reservedWidth: number = 0) => {
    const availableWidth = totalWidth - reservedWidth
    const cabinets: number[] = []
    let remaining = availableWidth

    // Fill with standard cabinet sizes (largest first)
    const sortedWidths = [...STANDARD_CABINET_WIDTHS].sort((a, b) => b - a)
    
    while (remaining > 0) {
      const fitting = sortedWidths.find(w => w <= remaining)
      if (!fitting) break
      cabinets.push(fitting)
      remaining -= fitting
    }
    
    return cabinets
  }

  // Render base cabinet with door lines and dimensions
  const renderBaseCabinet = (x: number, y: number, widthIn: number, isVertical = false, showDimension = true) => {
    const w = isVertical ? baseDepthPx : toPixels(widthIn)
    const h = isVertical ? toPixels(widthIn) : baseDepthPx
    const id = `base-${x}-${y}-${widthIn}`
    
    return (
      <g key={id}>
        {/* Cabinet body */}
        <rect x={x} y={y} width={w} height={h} fill="#f5f0e8" stroke="#1a1a1a" strokeWidth={1.5} />
        {/* Door panel(s) */}
        {widthIn >= 24 ? (
          // Double door
          <>
            <rect x={x + 3} y={y + 3} width={(w - 9) / 2} height={h - 6} fill="none" stroke="#8b8073" strokeWidth={1} />
            <rect x={x + w / 2 + 1.5} y={y + 3} width={(w - 9) / 2} height={h - 6} fill="none" stroke="#8b8073" strokeWidth={1} />
            {/* Handles */}
            <circle cx={x + w / 2 - 6} cy={y + h / 2} r={2} fill="#666" />
            <circle cx={x + w / 2 + 6} cy={y + h / 2} r={2} fill="#666" />
          </>
        ) : (
          // Single door
          <>
            <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} fill="none" stroke="#8b8073" strokeWidth={1} />
            <circle cx={isVertical ? x + w / 2 : x + w - 10} cy={isVertical ? y + 10 : y + h / 2} r={2} fill="#666" />
          </>
        )}
        {/* Width dimension label */}
        {showDimension && (
          <text
            x={x + w / 2}
            y={y + h + 12}
            textAnchor="middle"
            className="text-[8px]"
            fill="#666"
          >
            {widthIn}&quot;
          </text>
        )}
      </g>
    )
  }

  // Render wall cabinet (shown as dashed outline above base)
  const renderWallCabinet = (x: number, y: number, widthIn: number, isVertical = false) => {
    const w = isVertical ? wallDepthPx : toPixels(widthIn)
    const h = isVertical ? toPixels(widthIn) : wallDepthPx
    const id = `wall-${x}-${y}-${widthIn}`
    
    return (
      <g key={id}>
        {/* Wall cabinet outline - dashed */}
        <rect 
          x={x} 
          y={y} 
          width={w} 
          height={h} 
          fill="rgba(200, 195, 185, 0.3)" 
          stroke="#666" 
          strokeWidth={1} 
          strokeDasharray="4 2" 
        />
        {/* Diagonal lines to indicate wall cabinet */}
        <line x1={x} y1={y} x2={x + w} y2={y + h} stroke="#999" strokeWidth={0.5} strokeDasharray="2 2" />
        <line x1={x + w} y1={y} x2={x} y2={y + h} stroke="#999" strokeWidth={0.5} strokeDasharray="2 2" />
      </g>
    )
  }

  // Render detailed sink
  const renderSink = (x: number, y: number, widthIn: number, isVertical = false) => {
    const w = isVertical ? baseDepthPx : toPixels(widthIn)
    const h = isVertical ? toPixels(widthIn) : baseDepthPx
    const cx = x + w / 2
    const cy = y + h / 2
    
    return (
      <g>
        {/* Counter/cabinet */}
        <rect x={x} y={y} width={w} height={h} fill="#e8e4df" stroke="#1a1a1a" strokeWidth={1.5} />
        {/* Double basin */}
        <rect x={x + 6} y={y + 6} width={w * 0.42} height={h - 12} fill="#f8f8f8" stroke="#1a1a1a" strokeWidth={1} rx={3} />
        <rect x={x + w * 0.52} y={y + 6} width={w * 0.42} height={h - 12} fill="#f8f8f8" stroke="#1a1a1a" strokeWidth={1} rx={3} />
        {/* Drains */}
        <circle cx={x + 6 + w * 0.21} cy={cy} r={3} fill="#333" />
        <circle cx={x + w * 0.52 + w * 0.21} cy={cy} r={3} fill="#333" />
        {/* Faucet */}
        <ellipse cx={cx} cy={y + 8} rx={8} ry={4} fill="#888" stroke="#666" strokeWidth={0.5} />
        <rect x={cx - 2} y={y + 10} width={4} height={12} fill="#888" />
        <ellipse cx={cx} cy={y + 22} rx={6} ry={3} fill="#888" stroke="#666" strokeWidth={0.5} />
        {/* Label */}
        <text x={cx} y={y + h + 12} textAnchor="middle" className="text-[8px] font-medium" fill="#1a1a1a">
          SINK {widthIn}&quot;
        </text>
      </g>
    )
  }

  // Render detailed range/cooktop
  const renderRange = (x: number, y: number, widthIn: number, isVertical = false) => {
    const w = isVertical ? baseDepthPx : toPixels(widthIn)
    const h = isVertical ? toPixels(widthIn) : baseDepthPx
    const burnerR = Math.min(w, h) * 0.12
    
    return (
      <g>
        {/* Range body */}
        <rect x={x} y={y} width={w} height={h} fill="#1a1a1a" stroke="#1a1a1a" strokeWidth={1.5} />
        {/* Cooktop surface */}
        <rect x={x + 4} y={y + 4} width={w - 8} height={h - 12} fill="#2a2a2a" stroke="#333" strokeWidth={0.5} />
        {/* 4 burners */}
        {[
          [x + w * 0.28, y + h * 0.32],
          [x + w * 0.72, y + h * 0.32],
          [x + w * 0.28, y + h * 0.65],
          [x + w * 0.72, y + h * 0.65],
        ].map(([bx, by], i) => (
          <g key={i}>
            <circle cx={bx} cy={by} r={burnerR} fill="none" stroke="#555" strokeWidth={2} />
            <circle cx={bx} cy={by} r={burnerR * 0.65} fill="none" stroke="#444" strokeWidth={1.5} />
            <circle cx={bx} cy={by} r={burnerR * 0.3} fill="#333" />
            {/* Grates */}
            <line x1={bx - burnerR * 0.8} y1={by} x2={bx + burnerR * 0.8} y2={by} stroke="#444" strokeWidth={1} />
            <line x1={bx} y1={by - burnerR * 0.8} x2={bx} y2={by + burnerR * 0.8} stroke="#444" strokeWidth={1} />
          </g>
        ))}
        {/* Control panel */}
        <rect x={x + 6} y={y + h - 8} width={w - 12} height={5} fill="#333" rx={1} />
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((pos, i) => (
          <circle key={i} cx={x + w * pos} cy={y + h - 5.5} r={2} fill="#666" />
        ))}
        {/* Label */}
        <text x={x + w / 2} y={y + h + 12} textAnchor="middle" className="text-[8px] font-medium" fill="#1a1a1a">
          RANGE {widthIn}&quot;
        </text>
      </g>
    )
  }

  // Render detailed refrigerator
  const renderFridge = (x: number, y: number, widthIn: number, depthIn: number, isVertical = false) => {
    const w = isVertical ? toPixels(depthIn) : toPixels(widthIn)
    const h = isVertical ? toPixels(widthIn) : toPixels(depthIn)
    
    return (
      <g>
        {/* Fridge body */}
        <rect x={x} y={y} width={w} height={h} fill="#d8d8d8" stroke="#1a1a1a" strokeWidth={2} />
        {/* French doors (top) */}
        <rect x={x + 3} y={y + 3} width={w / 2 - 5} height={h * 0.65} fill="#e8e8e8" stroke="#aaa" strokeWidth={0.5} />
        <rect x={x + w / 2 + 2} y={y + 3} width={w / 2 - 5} height={h * 0.65} fill="#e8e8e8" stroke="#aaa" strokeWidth={0.5} />
        {/* Freezer drawer (bottom) */}
        <rect x={x + 3} y={y + h * 0.68} width={w - 6} height={h * 0.29} fill="#e0e0e0" stroke="#aaa" strokeWidth={0.5} />
        {/* Handles */}
        <line x1={x + w / 2 - 4} y1={y + h * 0.15} x2={x + w / 2 - 4} y2={y + h * 0.45} stroke="#888" strokeWidth={2} strokeLinecap="round" />
        <line x1={x + w / 2 + 4} y1={y + h * 0.15} x2={x + w / 2 + 4} y2={y + h * 0.45} stroke="#888" strokeWidth={2} strokeLinecap="round" />
        <line x1={x + w * 0.3} y1={y + h * 0.82} x2={x + w * 0.7} y2={y + h * 0.82} stroke="#888" strokeWidth={2} strokeLinecap="round" />
        {/* Label */}
        <text x={x + w / 2} y={y + h + 12} textAnchor="middle" className="text-[8px] font-medium" fill="#1a1a1a">
          REF {widthIn}&quot;x{depthIn}&quot;
        </text>
      </g>
    )
  }

  // Render dishwasher
  const renderDishwasher = (x: number, y: number, widthIn: number, isVertical = false) => {
    const w = isVertical ? baseDepthPx : toPixels(widthIn)
    const h = isVertical ? toPixels(widthIn) : baseDepthPx
    
    return (
      <g>
        {/* Body */}
        <rect x={x} y={y} width={w} height={h} fill="#c0c0c0" stroke="#1a1a1a" strokeWidth={1.5} />
        {/* Control panel */}
        <rect x={x + 4} y={y + 4} width={w - 8} height={8} fill="#333" rx={1} />
        {/* Door panel */}
        <rect x={x + 4} y={y + 14} width={w - 8} height={h - 20} fill="#d0d0d0" stroke="#aaa" strokeWidth={0.5} />
        {/* Handle */}
        <line x1={x + 10} y1={y + h / 2 + 5} x2={x + w - 10} y2={y + h / 2 + 5} stroke="#666" strokeWidth={3} strokeLinecap="round" />
        {/* Label */}
        <text x={x + w / 2} y={y + h + 12} textAnchor="middle" className="text-[8px] font-medium" fill="#1a1a1a">
          DW {widthIn}&quot;
        </text>
      </g>
    )
  }

  // Render cabinet run with dimensions
  const renderCabinetRun = (
    startX: number, 
    startY: number, 
    cabinets: { type: 'base' | 'appliance', width: number, applianceType?: 'sink' | 'range' | 'dishwasher' | 'fridge' }[],
    direction: 'horizontal' | 'vertical',
    showWallCabinets = true
  ) => {
    let currentX = startX
    let currentY = startY
    
    return (
      <g>
        {cabinets.map((cab, i) => {
          const x = currentX
          const y = currentY
          const isVertical = direction === 'vertical'
          
          let element: React.ReactNode = null
          
          if (cab.type === 'appliance') {
            switch (cab.applianceType) {
              case 'sink':
                element = renderSink(x, y, cab.width, isVertical)
                // No wall cabinet above sink
                break
              case 'range':
                element = renderRange(x, y, cab.width, isVertical)
                // No wall cabinet above range (hood instead)
                break
              case 'dishwasher':
                element = renderDishwasher(x, y, cab.width, isVertical)
                if (showWallCabinets) {
                  element = (
                    <>
                      {element}
                      {renderWallCabinet(
                        isVertical ? x + baseDepthPx + 4 : x,
                        isVertical ? y : y - wallDepthPx - 4,
                        cab.width,
                        isVertical
                      )}
                    </>
                  )
                }
                break
              case 'fridge':
                element = renderFridge(x, y, cab.width, 30, isVertical)
                // No wall cabinet above fridge
                break
            }
          } else {
            element = (
              <>
                {renderBaseCabinet(x, y, cab.width, isVertical)}
                {showWallCabinets && renderWallCabinet(
                  isVertical ? x + baseDepthPx + 4 : x,
                  isVertical ? y : y - wallDepthPx - 4,
                  cab.width,
                  isVertical
                )}
              </>
            )
          }
          
          if (isVertical) {
            currentY += toPixels(cab.width)
          } else {
            currentX += toPixels(cab.width)
          }
          
          return <g key={i}>{element}</g>
        })}
      </g>
    )
  }

  // Render dimension line
  const renderDimension = (x1: number, y1: number, x2: number, y2: number, label: string, offset = 20, showTicks = true) => {
    const isHorizontal = Math.abs(y2 - y1) < Math.abs(x2 - x1)
    const midX = (x1 + x2) / 2
    const midY = (y1 + y2) / 2
    
    return (
      <g>
        {showTicks && (
          <>
            {isHorizontal ? (
              <>
                <line x1={x1} y1={y1 - 5} x2={x1} y2={y1 + offset + 5} stroke="#444" strokeWidth={0.5} />
                <line x1={x2} y1={y2 - 5} x2={x2} y2={y2 + offset + 5} stroke="#444" strokeWidth={0.5} />
              </>
            ) : (
              <>
                <line x1={x1 - offset - 5} y1={y1} x2={x1 + 5} y2={y1} stroke="#444" strokeWidth={0.5} />
                <line x1={x2 - offset - 5} y1={y2} x2={x2 + 5} y2={y2} stroke="#444" strokeWidth={0.5} />
              </>
            )}
          </>
        )}
        <line 
          x1={isHorizontal ? x1 : x1 - offset}
          y1={isHorizontal ? y1 + offset : y1}
          x2={isHorizontal ? x2 : x2 - offset}
          y2={isHorizontal ? y2 + offset : y2}
          stroke="#444"
          strokeWidth={1}
          markerStart="url(#arrow-start)"
          markerEnd="url(#arrow-end)"
        />
        <rect 
          x={midX - (isHorizontal ? 24 : 16)}
          y={midY + (isHorizontal ? offset - 8 : -8)}
          width={isHorizontal ? 48 : 32}
          height={16}
          fill="white"
        />
        <text
          x={isHorizontal ? midX : midX - offset}
          y={isHorizontal ? midY + offset + 4 : midY + 4}
          textAnchor="middle"
          className="text-[10px] font-medium"
          fill="#333"
        >
          {label}
        </text>
      </g>
    )
  }

  // Render work triangle
  const renderWorkTriangle = (points: [number, number][]) => {
    if (points.length < 3) return null
    const pathData = `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]} L ${points[2][0]} ${points[2][1]} Z`
    
    return (
      <g>
        <path d={pathData} fill="rgba(59, 130, 246, 0.06)" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="8 4" />
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={5} fill="#3b82f6" />
        ))}
      </g>
    )
  }

  const renderLayout = () => {
    const ox = MARGIN
    const oy = MARGIN

    switch (layout) {
      case "l-shaped": {
        // Top wall cabinets and base
        const topCabinets = [
          { type: 'base' as const, width: 36 },
          { type: 'appliance' as const, width: 36, applianceType: 'sink' as const },
          { type: 'appliance' as const, width: 24, applianceType: 'dishwasher' as const },
          { type: 'base' as const, width: 24 },
          { type: 'appliance' as const, width: 30, applianceType: 'range' as const },
          { type: 'base' as const, width: 18 },
        ]
        
        // Left wall
        const leftCabinets = [
          { type: 'base' as const, width: 36 },
          { type: 'appliance' as const, width: 36, applianceType: 'fridge' as const },
          { type: 'base' as const, width: 24 },
        ]

        const sinkPos: [number, number] = [ox + toPixels(36) + toPixels(18), oy + baseDepthPx / 2]
        const rangePos: [number, number] = [ox + toPixels(36 + 36 + 24 + 24 + 15), oy + baseDepthPx / 2]
        const fridgePos: [number, number] = [ox + baseDepthPx / 2, oy + baseDepthPx + toPixels(36 + 18)]

        return (
          <>
            {renderCabinetRun(ox, oy, topCabinets, 'horizontal')}
            {renderCabinetRun(ox, oy + baseDepthPx, leftCabinets, 'vertical')}
            {renderWorkTriangle([sinkPos, rangePos, fridgePos])}
          </>
        )
      }

      case "u-shaped": {
        const topCabinets = [
          { type: 'base' as const, width: 30 },
          { type: 'appliance' as const, width: 36, applianceType: 'sink' as const },
          { type: 'appliance' as const, width: 24, applianceType: 'dishwasher' as const },
          { type: 'base' as const, width: 30 },
        ]
        
        const leftCabinets = [
          { type: 'base' as const, width: 30 },
          { type: 'appliance' as const, width: 36, applianceType: 'fridge' as const },
          { type: 'base' as const, width: 24 },
        ]
        
        const rightCabinets = [
          { type: 'base' as const, width: 24 },
          { type: 'appliance' as const, width: 30, applianceType: 'range' as const },
          { type: 'base' as const, width: 36 },
        ]

        const sinkPos: [number, number] = [ox + toPixels(30 + 18), oy + baseDepthPx / 2]
        const rangePos: [number, number] = [ox + roomWidth - baseDepthPx / 2, oy + baseDepthPx + toPixels(24 + 15)]
        const fridgePos: [number, number] = [ox + baseDepthPx / 2, oy + baseDepthPx + toPixels(30 + 18)]

        return (
          <>
            {renderCabinetRun(ox, oy, topCabinets, 'horizontal')}
            {renderCabinetRun(ox, oy + baseDepthPx, leftCabinets, 'vertical')}
            {renderCabinetRun(ox + roomWidth - baseDepthPx, oy + baseDepthPx, rightCabinets, 'vertical', false)}
            {renderWorkTriangle([sinkPos, rangePos, fridgePos])}
          </>
        )
      }

      case "galley": {
        const leftCabinets = [
          { type: 'base' as const, width: 24 },
          { type: 'appliance' as const, width: 36, applianceType: 'sink' as const },
          { type: 'appliance' as const, width: 24, applianceType: 'dishwasher' as const },
          { type: 'appliance' as const, width: 30, applianceType: 'range' as const },
          { type: 'base' as const, width: 24 },
        ]
        
        const rightCabinets = [
          { type: 'base' as const, width: 36 },
          { type: 'appliance' as const, width: 36, applianceType: 'fridge' as const },
          { type: 'base' as const, width: 36 },
          { type: 'base' as const, width: 30 },
        ]

        const sinkPos: [number, number] = [ox + baseDepthPx / 2, oy + toPixels(24 + 18)]
        const rangePos: [number, number] = [ox + baseDepthPx / 2, oy + toPixels(24 + 36 + 24 + 15)]
        const fridgePos: [number, number] = [ox + roomWidth - baseDepthPx / 2, oy + toPixels(36 + 18)]

        return (
          <>
            {renderCabinetRun(ox, oy, leftCabinets, 'vertical')}
            {renderCabinetRun(ox + roomWidth - baseDepthPx, oy, rightCabinets, 'vertical', false)}
            {renderWorkTriangle([sinkPos, rangePos, fridgePos])}
          </>
        )
      }

      case "island": {
        const topCabinets = [
          { type: 'appliance' as const, width: 36, applianceType: 'fridge' as const },
          { type: 'base' as const, width: 24 },
          { type: 'appliance' as const, width: 36, applianceType: 'sink' as const },
          { type: 'appliance' as const, width: 24, applianceType: 'dishwasher' as const },
          { type: 'base' as const, width: 30 },
        ]
        
        // Island
        const islandWidth = Math.min(roomWidthIn * 0.5, 72)
        const islandDepth = 36
        const islandX = ox + (roomWidth - toPixels(islandWidth)) / 2
        const islandY = oy + roomHeight * 0.55

        const sinkPos: [number, number] = [ox + toPixels(36 + 24 + 18), oy + baseDepthPx / 2]
        const rangePos: [number, number] = [islandX + toPixels(islandWidth) / 2, islandY + toPixels(islandDepth) / 2]
        const fridgePos: [number, number] = [ox + toPixels(18), oy + baseDepthPx / 2]

        return (
          <>
            {renderCabinetRun(ox, oy, topCabinets, 'horizontal')}
            {/* Island with cooktop */}
            <g>
              <rect x={islandX} y={islandY} width={toPixels(islandWidth)} height={toPixels(islandDepth)} fill="#f5f0e8" stroke="#1a1a1a" strokeWidth={2} />
              <rect x={islandX + 3} y={islandY + 3} width={toPixels(islandWidth) - 6} height={toPixels(islandDepth) - 6} fill="none" stroke="#8b8073" strokeWidth={1} />
              {/* Cooktop on island */}
              {renderRange(islandX + toPixels(islandWidth) / 2 - toPixels(15), islandY + 4, 30)}
              {/* Seating indicators */}
              {Array.from({ length: Math.floor(islandWidth / 24) }).map((_, i) => (
                <circle key={i} cx={islandX + toPixels(12) + i * toPixels(24)} cy={islandY + toPixels(islandDepth) + 25} r={12} fill="none" stroke="#888" strokeWidth={1.5} strokeDasharray="4 2" />
              ))}
              {/* Island dimension */}
              {renderDimension(islandX, islandY + toPixels(islandDepth) + 45, islandX + toPixels(islandWidth), islandY + toPixels(islandDepth) + 45, `${islandWidth}"`, 0, false)}
            </g>
            {renderWorkTriangle([sinkPos, rangePos, fridgePos])}
          </>
        )
      }

      case "single-wall": {
        const cabinets = [
          { type: 'appliance' as const, width: 36, applianceType: 'fridge' as const },
          { type: 'base' as const, width: 18 },
          { type: 'appliance' as const, width: 36, applianceType: 'sink' as const },
          { type: 'appliance' as const, width: 24, applianceType: 'dishwasher' as const },
          { type: 'appliance' as const, width: 30, applianceType: 'range' as const },
          { type: 'base' as const, width: 24 },
        ]

        const sinkPos: [number, number] = [ox + toPixels(36 + 18 + 18), oy + baseDepthPx / 2]
        const rangePos: [number, number] = [ox + toPixels(36 + 18 + 36 + 24 + 15), oy + baseDepthPx / 2]
        const fridgePos: [number, number] = [ox + toPixels(18), oy + baseDepthPx / 2]

        return (
          <>
            {renderCabinetRun(ox, oy, cabinets, 'horizontal')}
            {renderWorkTriangle([sinkPos, rangePos, fridgePos])}
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
        style={{ maxHeight: "550px" }}
      >
        {/* Defs for arrows */}
        <defs>
          <pattern id="grid" width={toPixels(12)} height={toPixels(12)} patternUnits="userSpaceOnUse">
            <path d={`M ${toPixels(12)} 0 L 0 0 0 ${toPixels(12)}`} fill="none" stroke="#e8e8e8" strokeWidth={0.5} />
          </pattern>
          <marker id="arrow-start" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
            <polygon points="6,0 6,6 0,3" fill="#444" />
          </marker>
          <marker id="arrow-end" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
            <polygon points="0,0 6,3 0,6" fill="#444" />
          </marker>
        </defs>

        {/* Background grid (1' squares) */}
        <rect x={MARGIN} y={MARGIN} width={roomWidth} height={roomHeight} fill="url(#grid)" />

        {/* Room outline */}
        <rect x={MARGIN} y={MARGIN} width={roomWidth} height={roomHeight} fill="none" stroke="#1a1a1a" strokeWidth={6} />

        {/* Room dimensions */}
        {renderDimension(MARGIN, MARGIN + roomHeight, MARGIN + roomWidth, MARGIN + roomHeight, `${width}'-0"`, 35)}
        {renderDimension(MARGIN, MARGIN, MARGIN, MARGIN + roomHeight, `${depth}'-0"`, 35)}

        {/* Layout */}
        {renderLayout()}

        {/* Title block */}
        <g transform={`translate(${svgWidth - 120}, ${svgHeight - 55})`}>
          <rect x={0} y={0} width={110} height={50} fill="white" stroke="#1a1a1a" strokeWidth={1} />
          <line x1={0} y1={18} x2={110} y2={18} stroke="#1a1a1a" strokeWidth={0.5} />
          <line x1={0} y1={34} x2={110} y2={34} stroke="#1a1a1a" strokeWidth={0.5} />
          <text x={55} y={12} textAnchor="middle" className="text-[8px] font-medium" fill="#1a1a1a">KITCHEN FLOOR PLAN</text>
          <text x={55} y={28} textAnchor="middle" className="text-[7px]" fill="#666">SCALE: 1" = 2'-0"</text>
          <text x={55} y={44} textAnchor="middle" className="text-[7px]" fill="#666">{layout.toUpperCase().replace('-', ' ')} LAYOUT</text>
        </g>
      </svg>

      {/* Enhanced Legend */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-6 bg-[#f5f0e8] border border-[#1a1a1a] rounded-sm relative">
              <div className="absolute inset-1 border border-[#8b8073]" />
            </div>
            <div>
              <div className="text-xs font-medium text-foreground">Base Cabinet</div>
              <div className="text-[10px] text-muted-foreground">24&quot; deep</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 border border-dashed border-[#666] bg-[rgba(200,195,185,0.3)] rounded-sm relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-[1px] bg-[#999] rotate-45 origin-center" style={{width: '120%'}} />
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-foreground">Wall Cabinet</div>
              <div className="text-[10px] text-muted-foreground">12&quot; deep</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <svg width="32" height="24" viewBox="0 0 32 24">
              <rect x="2" y="2" width="28" height="20" fill="#e8e4df" stroke="#1a1a1a" strokeWidth="1" />
              <rect x="5" y="5" width="10" height="14" fill="#f8f8f8" stroke="#1a1a1a" strokeWidth="0.5" rx="1" />
              <rect x="17" y="5" width="10" height="14" fill="#f8f8f8" stroke="#1a1a1a" strokeWidth="0.5" rx="1" />
            </svg>
            <div>
              <div className="text-xs font-medium text-foreground">Sink</div>
              <div className="text-[10px] text-muted-foreground">36&quot; std</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <svg width="32" height="24" viewBox="0 0 32 24">
              <rect x="2" y="2" width="28" height="20" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="1" />
              <circle cx="10" cy="8" r="4" fill="none" stroke="#555" strokeWidth="1" />
              <circle cx="22" cy="8" r="4" fill="none" stroke="#555" strokeWidth="1" />
              <circle cx="10" cy="16" r="4" fill="none" stroke="#555" strokeWidth="1" />
              <circle cx="22" cy="16" r="4" fill="none" stroke="#555" strokeWidth="1" />
            </svg>
            <div>
              <div className="text-xs font-medium text-foreground">Range</div>
              <div className="text-[10px] text-muted-foreground">30&quot; std</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <svg width="28" height="32" viewBox="0 0 28 32">
              <rect x="2" y="2" width="24" height="28" fill="#d8d8d8" stroke="#1a1a1a" strokeWidth="1.5" />
              <rect x="4" y="4" width="9" height="16" fill="#e8e8e8" stroke="#aaa" strokeWidth="0.5" />
              <rect x="15" y="4" width="9" height="16" fill="#e8e8e8" stroke="#aaa" strokeWidth="0.5" />
              <rect x="4" y="22" width="20" height="6" fill="#e0e0e0" stroke="#aaa" strokeWidth="0.5" />
            </svg>
            <div>
              <div className="text-xs font-medium text-foreground">Refrigerator</div>
              <div className="text-[10px] text-muted-foreground">36&quot;x30&quot; std</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <svg width="32" height="24" viewBox="0 0 32 24">
              <rect x="2" y="2" width="28" height="20" fill="#c0c0c0" stroke="#1a1a1a" strokeWidth="1" />
              <rect x="4" y="4" width="24" height="5" fill="#333" rx="1" />
              <line x1="8" y1="14" x2="24" y2="14" stroke="#666" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div>
              <div className="text-xs font-medium text-foreground">Dishwasher</div>
              <div className="text-[10px] text-muted-foreground">24&quot; std</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <svg width="32" height="20" viewBox="0 0 32 20">
              <line x1="4" y1="10" x2="28" y2="10" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 3" />
              <circle cx="4" cy="10" r="4" fill="#3b82f6" />
              <circle cx="28" cy="10" r="4" fill="#3b82f6" />
            </svg>
            <div>
              <div className="text-xs font-medium text-foreground">Work Triangle</div>
              <div className="text-[10px] text-muted-foreground">Sink-Range-Fridge</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Standard Widths:</span>
            <span>12&quot; 15&quot; 18&quot; 24&quot; 30&quot; 36&quot;</span>
          </div>
        </div>
      </div>
    </div>
  )
}
