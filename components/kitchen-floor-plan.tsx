"use client"

import { cn } from "@/lib/utils"

export type KitchenLayoutType = "l-shaped" | "u-shaped" | "galley" | "island" | "single-wall"

interface KitchenFloorPlanProps {
  width: number
  depth: number
  layout: KitchenLayoutType
  className?: string
}

// Standard dimensions in inches
const BASE_CABINET_DEPTH = 24
const WALL_CABINET_DEPTH = 12
const COUNTER_OVERHANG = 1.5

const SCALE = 3 // pixels per inch
const MARGIN = 70

const toPixels = (inches: number) => inches * SCALE

export function KitchenFloorPlan({ width, depth, layout, className }: KitchenFloorPlanProps) {
  const roomWidthIn = width * 12
  const roomDepthIn = depth * 12
  const roomWidthPx = toPixels(roomWidthIn)
  const roomDepthPx = toPixels(roomDepthIn)
  const svgWidth = roomWidthPx + MARGIN * 2
  const svgHeight = roomDepthPx + MARGIN * 2
  const baseCabinetPx = toPixels(BASE_CABINET_DEPTH)
  const wallCabinetPx = toPixels(WALL_CABINET_DEPTH)

  // Base cabinet - TOP DOWN FLOOR PLAN VIEW (shows footprint with counter and door swing arcs)
  const renderBaseCabinet = (x: number, y: number, widthIn: number, orientation: 'top' | 'bottom' | 'left' | 'right' = 'top') => {
    const w = (orientation === 'left' || orientation === 'right') ? baseCabinetPx : toPixels(widthIn)
    const h = (orientation === 'left' || orientation === 'right') ? toPixels(widthIn) : baseCabinetPx
    const numDoors = widthIn >= 30 ? 2 : 1
    const doorWidth = numDoors === 2 ? w / 2 : w
    
    // Door swing arc paths based on orientation
    const renderDoorSwing = (doorX: number, doorY: number, doorW: number, doorH: number, isLeft: boolean) => {
      if (orientation === 'top') {
        // Doors open downward (toward room)
        const arcX = isLeft ? doorX : doorX + doorW
        const arcEndX = isLeft ? doorX + doorW * 0.9 : doorX + doorW * 0.1
        return (
          <path 
            d={`M ${arcX} ${doorY + doorH} A ${doorW * 0.9} ${doorW * 0.9} 0 0 ${isLeft ? 1 : 0} ${arcEndX} ${doorY + doorH + doorW * 0.9}`}
            fill="none" stroke="#888" strokeWidth={0.75} strokeDasharray="4 2"
          />
        )
      } else if (orientation === 'left') {
        // Doors open rightward (toward room)
        const arcY = isLeft ? doorY : doorY + doorH
        const arcEndY = isLeft ? doorY + doorH * 0.9 : doorY + doorH * 0.1
        return (
          <path 
            d={`M ${doorX + doorW} ${arcY} A ${doorH * 0.9} ${doorH * 0.9} 0 0 ${isLeft ? 0 : 1} ${doorX + doorW + doorH * 0.9} ${arcEndY}`}
            fill="none" stroke="#888" strokeWidth={0.75} strokeDasharray="4 2"
          />
        )
      } else if (orientation === 'right') {
        // Doors open leftward
        const arcY = isLeft ? doorY : doorY + doorH
        const arcEndY = isLeft ? doorY + doorH * 0.9 : doorY + doorH * 0.1
        return (
          <path 
            d={`M ${doorX} ${arcY} A ${doorH * 0.9} ${doorH * 0.9} 0 0 ${isLeft ? 1 : 0} ${doorX - doorH * 0.9} ${arcEndY}`}
            fill="none" stroke="#888" strokeWidth={0.75} strokeDasharray="4 2"
          />
        )
      }
      return null
    }
    
    return (
      <g key={`base-${x}-${y}-${widthIn}`}>
        {/* Cabinet footprint */}
        <rect x={x} y={y} width={w} height={h} fill="#f5f0e8" stroke="#2d2d2d" strokeWidth={1.5} />
        
        {/* Counter edge (thick line at front) */}
        {orientation === 'top' && <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke="#8b7355" strokeWidth={4} />}
        {orientation === 'bottom' && <line x1={x} y1={y} x2={x + w} y2={y} stroke="#8b7355" strokeWidth={4} />}
        {orientation === 'left' && <line x1={x + w} y1={y} x2={x + w} y2={y + h} stroke="#8b7355" strokeWidth={4} />}
        {orientation === 'right' && <line x1={x} y1={y} x2={x} y2={y + h} stroke="#8b7355" strokeWidth={4} />}
        
        {/* Door swing arcs */}
        {numDoors === 2 ? (
          <>
            {renderDoorSwing(x, y, doorWidth - 2, h, true)}
            {renderDoorSwing(x + doorWidth + 2, y, doorWidth - 2, h, false)}
          </>
        ) : (
          renderDoorSwing(x, y, w, h, true)
        )}
        
        {/* Cabinet width dimension */}
        <text x={x + w / 2} y={orientation === 'top' ? y + h + 16 : y - 8} textAnchor="middle" fontSize={9} fill="#555">{widthIn}&quot;</text>
      </g>
    )
  }

  // Wall cabinet - TOP DOWN FLOOR PLAN VIEW (shown as dashed outline above base cabinets)
  const renderWallCabinet = (x: number, y: number, widthIn: number, orientation: 'top' | 'bottom' | 'left' | 'right' = 'top') => {
    // Wall cabinets are shown positioned at the wall (behind base cabinets in plan view)
    // They appear as dashed rectangles indicating they're above
    const ww = (orientation === 'left' || orientation === 'right') ? wallCabinetPx : toPixels(widthIn)
    const wh = (orientation === 'left' || orientation === 'right') ? toPixels(widthIn) : wallCabinetPx
    
    // Position at wall edge (inside the base cabinet area, at the back wall)
    let wx = x, wy = y
    if (orientation === 'top') {
      wy = y  // At top of base cabinet (wall side)
    } else if (orientation === 'left') {
      wx = x  // At left edge
    } else if (orientation === 'right') {
      wx = x + baseCabinetPx - wallCabinetPx
    }
    
    return (
      <g key={`wall-${x}-${y}-${widthIn}`}>
        {/* Wall cabinet shown as dashed outline */}
        <rect x={wx} y={wy} width={ww} height={wh} fill="none" stroke="#666" strokeWidth={1.5} strokeDasharray="8 4" />
        {/* Diagonal lines indicating "above" */}
        <line x1={wx} y1={wy} x2={wx + ww} y2={wy + wh} stroke="#aaa" strokeWidth={0.5} strokeDasharray="3 3" />
        <line x1={wx + ww} y1={wy} x2={wx} y2={wy + wh} stroke="#aaa" strokeWidth={0.5} strokeDasharray="3 3" />
      </g>
    )
  }

  // Sink - TOP DOWN FLOOR PLAN VIEW (shows cabinet footprint with sink bowls cutout)
  const renderSink = (x: number, y: number, widthIn: number, orientation: 'top' | 'bottom' | 'left' | 'right' = 'top') => {
    const w = (orientation === 'left' || orientation === 'right') ? baseCabinetPx : toPixels(widthIn)
    const h = (orientation === 'left' || orientation === 'right') ? toPixels(widthIn) : baseCabinetPx
    const isVertical = orientation === 'left' || orientation === 'right'
    
    // Bowl dimensions for top-down view
    const bowlW = isVertical ? h * 0.36 : w * 0.36
    const bowlH = isVertical ? w * 0.65 : h * 0.55
    const bowlGap = 6
    
    return (
      <g key={`sink-${x}-${y}`}>
        {/* Counter/cabinet footprint */}
        <rect x={x} y={y} width={w} height={h} fill="#f5f0e8" stroke="#2d2d2d" strokeWidth={1.5} />
        
        {/* Counter edge (thick line at front) */}
        {orientation === 'top' && <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke="#8b7355" strokeWidth={4} />}
        {orientation === 'left' && <line x1={x + w} y1={y} x2={x + w} y2={y + h} stroke="#8b7355" strokeWidth={4} />}
        
        {/* Sink basin outline (double bowl) */}
        {isVertical ? (
          <>
            {/* Two bowls stacked vertically */}
            <rect x={x + (w - bowlH) / 2} y={y + h * 0.1} width={bowlH} height={bowlW} fill="#e8e8e8" stroke="#555" strokeWidth={1.5} rx={4} />
            <rect x={x + (w - bowlH) / 2} y={y + h * 0.1 + bowlW + bowlGap} width={bowlH} height={bowlW} fill="#e8e8e8" stroke="#555" strokeWidth={1.5} rx={4} />
            {/* Drains */}
            <circle cx={x + w / 2} cy={y + h * 0.1 + bowlW / 2} r={5} fill="#333" />
            <circle cx={x + w / 2} cy={y + h * 0.1 + bowlW + bowlGap + bowlW / 2} r={5} fill="#333" />
          </>
        ) : (
          <>
            {/* Two bowls side by side */}
            <rect x={x + w * 0.08} y={y + (h - bowlH) / 2} width={bowlW} height={bowlH} fill="#e8e8e8" stroke="#555" strokeWidth={1.5} rx={4} />
            <rect x={x + w * 0.08 + bowlW + bowlGap} y={y + (h - bowlH) / 2} width={bowlW} height={bowlH} fill="#e8e8e8" stroke="#555" strokeWidth={1.5} rx={4} />
            {/* Drains */}
            <circle cx={x + w * 0.08 + bowlW / 2} cy={y + h / 2} r={5} fill="#333" />
            <circle cx={x + w * 0.08 + bowlW + bowlGap + bowlW / 2} cy={y + h / 2} r={5} fill="#333" />
          </>
        )}
        
        {/* Faucet (small rectangle at wall side) */}
        {orientation === 'top' && (
          <>
            <rect x={x + w / 2 - 8} y={y + 4} width={16} height={10} fill="#999" stroke="#666" strokeWidth={1} rx={2} />
            <circle cx={x + w / 2} cy={y + 9} r={3} fill="#777" />
          </>
        )}
        {orientation === 'left' && (
          <>
            <rect x={x + 4} y={y + h / 2 - 8} width={10} height={16} fill="#999" stroke="#666" strokeWidth={1} rx={2} />
            <circle cx={x + 9} cy={y + h / 2} r={3} fill="#777" />
          </>
        )}
        
        {/* Label */}
        <text x={x + w / 2} y={orientation === 'top' ? y + h + 16 : y - 8} textAnchor="middle" fontSize={9} fontWeight={500} fill="#333">
          SINK {widthIn}&quot;
        </text>
      </g>
    )
  }

  // Range/Cooktop - TOP DOWN FLOOR PLAN VIEW (shows 4 burners from above)
  const renderRange = (x: number, y: number, widthIn: number, orientation: 'top' | 'bottom' | 'left' | 'right' = 'top') => {
    const w = (orientation === 'left' || orientation === 'right') ? baseCabinetPx : toPixels(widthIn)
    const h = (orientation === 'left' || orientation === 'right') ? toPixels(widthIn) : baseCabinetPx
    
    const burnerRadius = Math.min(w, h) * 0.14
    // Burner positions for top-down view
    const burnerPositions = orientation === 'top' || orientation === 'bottom' ? [
      { x: 0.27, y: 0.32 },
      { x: 0.73, y: 0.32 },
      { x: 0.27, y: 0.68 },
      { x: 0.73, y: 0.68 },
    ] : [
      { x: 0.32, y: 0.27 },
      { x: 0.32, y: 0.73 },
      { x: 0.68, y: 0.27 },
      { x: 0.68, y: 0.73 },
    ]
    
    return (
      <g key={`range-${x}-${y}`}>
        {/* Range footprint */}
        <rect x={x} y={y} width={w} height={h} fill="#2a2a2a" stroke="#1a1a1a" strokeWidth={2} />
        
        {/* Cooktop surface */}
        <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} fill="#333" stroke="#444" strokeWidth={0.5} />
        
        {/* Burners - top down view showing circular grates */}
        {burnerPositions.map((pos, i) => {
          const bx = x + w * pos.x
          const by = y + h * pos.y
          return (
            <g key={i}>
              {/* Outer burner ring */}
              <circle cx={bx} cy={by} r={burnerRadius} fill="none" stroke="#666" strokeWidth={2.5} />
              {/* Middle ring */}
              <circle cx={bx} cy={by} r={burnerRadius * 0.7} fill="none" stroke="#555" strokeWidth={1.5} />
              {/* Inner ring / burner cap */}
              <circle cx={bx} cy={by} r={burnerRadius * 0.35} fill="#444" stroke="#555" strokeWidth={1} />
              {/* Grate lines (cross pattern) */}
              <line x1={bx - burnerRadius} y1={by} x2={bx + burnerRadius} y2={by} stroke="#555" strokeWidth={3} />
              <line x1={bx} y1={by - burnerRadius} x2={bx} y2={by + burnerRadius} stroke="#555" strokeWidth={3} />
            </g>
          )
        })}
        
        {/* Label */}
        <text x={x + w / 2} y={orientation === 'top' ? y + h + 16 : y - 8} textAnchor="middle" fontSize={9} fontWeight={500} fill="#333">
          RANGE {widthIn}&quot;
        </text>
      </g>
    )
  }

  // Refrigerator - TOP DOWN FLOOR PLAN VIEW (shows footprint only)
  const renderFridge = (x: number, y: number, widthIn: number, depthIn: number, orientation: 'top' | 'bottom' | 'left' | 'right' = 'top') => {
    const w = (orientation === 'left' || orientation === 'right') ? toPixels(depthIn) : toPixels(widthIn)
    const h = (orientation === 'left' || orientation === 'right') ? toPixels(widthIn) : toPixels(depthIn)
    
    return (
      <g key={`fridge-${x}-${y}`}>
        {/* Fridge footprint - solid rectangle representing the unit */}
        <rect x={x} y={y} width={w} height={h} fill="#d0d0d0" stroke="#2d2d2d" strokeWidth={2} />
        
        {/* Inner outline to show it's an appliance */}
        <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} fill="none" stroke="#888" strokeWidth={1} />
        
        {/* Diagonal lines to indicate refrigerator (architectural convention) */}
        <line x1={x + 4} y1={y + 4} x2={x + w - 4} y2={y + h - 4} stroke="#999" strokeWidth={1} />
        <line x1={x + w - 4} y1={y + 4} x2={x + 4} y2={y + h - 4} stroke="#999" strokeWidth={1} />
        
        {/* REF label in center */}
        <rect x={x + w/2 - 14} y={y + h/2 - 8} width={28} height={16} fill="white" rx={2} />
        <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill="#333">
          REF
        </text>
        
        {/* Dimension label */}
        <text x={x + w / 2} y={orientation === 'top' ? y + h + 14 : y - 6} textAnchor="middle" fontSize={9} fill="#555">
          {widthIn}&quot;x{depthIn}&quot;
        </text>
      </g>
    )
  }

  // Dishwasher - TOP DOWN FLOOR PLAN VIEW
  const renderDishwasher = (x: number, y: number, widthIn: number, orientation: 'top' | 'bottom' | 'left' | 'right' = 'top') => {
    const w = (orientation === 'left' || orientation === 'right') ? baseCabinetPx : toPixels(widthIn)
    const h = (orientation === 'left' || orientation === 'right') ? toPixels(widthIn) : baseCabinetPx
    
    return (
      <g key={`dw-${x}-${y}`}>
        {/* Dishwasher footprint */}
        <rect x={x} y={y} width={w} height={h} fill="#e0e0e0" stroke="#2d2d2d" strokeWidth={1.5} />
        
        {/* Counter edge */}
        {orientation === 'top' && <line x1={x} y1={y + h - 2} x2={x + w} y2={y + h - 2} stroke="#b8a88a" strokeWidth={3} />}
        {orientation === 'left' && <line x1={x + w - 2} y1={y} x2={x + w - 2} y2={y + h} stroke="#b8a88a" strokeWidth={3} />}
        
        {/* Inner outline */}
        <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} fill="none" stroke="#999" strokeWidth={1} />
        
        {/* Circle pattern to indicate dishwasher (architectural convention) */}
        <circle cx={x + w/2} cy={y + h/2} r={Math.min(w, h) * 0.25} fill="none" stroke="#888" strokeWidth={1} />
        <circle cx={x + w/2} cy={y + h/2} r={Math.min(w, h) * 0.12} fill="#888" />
        
        {/* DW label */}
        <text x={x + w / 2} y={orientation === 'top' ? y + h + 14 : y - 6} textAnchor="middle" fontSize={9} fontWeight={500} fill="#333">
          DW {widthIn}&quot;
        </text>
      </g>
    )
  }

  // Dimension line with arrows
  const renderDimension = (x1: number, y1: number, x2: number, y2: number, label: string, offset = 25) => {
    const isHorizontal = Math.abs(y2 - y1) < 1
    const midX = (x1 + x2) / 2
    const midY = (y1 + y2) / 2
    
    return (
      <g>
        {/* Extension lines */}
        {isHorizontal ? (
          <>
            <line x1={x1} y1={y1 - 6} x2={x1} y2={y1 + offset + 8} stroke="#444" strokeWidth={0.5} />
            <line x1={x2} y1={y2 - 6} x2={x2} y2={y2 + offset + 8} stroke="#444" strokeWidth={0.5} />
            <line x1={x1} y1={y1 + offset} x2={x2} y2={y2 + offset} stroke="#444" strokeWidth={1} markerStart="url(#arrowL)" markerEnd="url(#arrowR)" />
          </>
        ) : (
          <>
            <line x1={x1 - offset - 8} y1={y1} x2={x1 + 6} y2={y1} stroke="#444" strokeWidth={0.5} />
            <line x1={x2 - offset - 8} y1={y2} x2={x2 + 6} y2={y2} stroke="#444" strokeWidth={0.5} />
            <line x1={x1 - offset} y1={y1} x2={x2 - offset} y2={y2} stroke="#444" strokeWidth={1} markerStart="url(#arrowU)" markerEnd="url(#arrowD)" />
          </>
        )}
        {/* Label background */}
        <rect x={isHorizontal ? midX - 22 : midX - offset - 20} y={isHorizontal ? midY + offset - 7 : midY - 7} width={44} height={14} fill="white" />
        {/* Label */}
        <text x={isHorizontal ? midX : midX - offset} y={isHorizontal ? midY + offset + 4 : midY + 4} textAnchor="middle" fontSize={11} fontWeight={500} fill="#333">{label}</text>
      </g>
    )
  }

  // Work triangle
  const renderWorkTriangle = (points: [number, number][], labels: string[]) => {
    if (points.length < 3) return null
    
    return (
      <g>
        <polygon points={points.map(p => p.join(',')).join(' ')} fill="rgba(59, 130, 246, 0.06)" stroke="#3b82f6" strokeWidth={2} strokeDasharray="10 5" />
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={6} fill="#3b82f6" />
        ))}
        {/* Edge labels */}
        {[
          { from: points[0], to: points[1], label: labels[0] },
          { from: points[1], to: points[2], label: labels[1] },
          { from: points[2], to: points[0], label: labels[2] },
        ].map((edge, i) => {
          const mx = (edge.from[0] + edge.to[0]) / 2
          const my = (edge.from[1] + edge.to[1]) / 2
          return (
            <g key={i}>
              <rect x={mx - 16} y={my - 8} width={32} height={16} fill="white" rx={3} stroke="#3b82f6" strokeWidth={1} />
              <text x={mx} y={my + 4} textAnchor="middle" fontSize={9} fill="#3b82f6">{edge.label}</text>
            </g>
          )
        })}
      </g>
    )
  }

  const calcDistance = (p1: [number, number], p2: [number, number]) => {
    const inches = Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2) / SCALE
    const feet = Math.floor(inches / 12)
    const remainingInches = Math.round(inches % 12)
    return `${feet}'${remainingInches}"`
  }

  const renderLayout = () => {
    const ox = MARGIN
    const oy = MARGIN

    switch (layout) {
      case "l-shaped": {
        // Top run
        let cx = ox
        const topY = oy
        
        const elements: React.ReactNode[] = []
        
        // Corner cabinet
        elements.push(renderBaseCabinet(cx, topY, 36, 'top'))
        elements.push(renderWallCabinet(cx, topY, 36, 'top'))
        cx += toPixels(36)
        
        // Sink
        elements.push(renderSink(cx, topY, 36, 'top'))
        cx += toPixels(36)
        
        // Dishwasher
        elements.push(renderDishwasher(cx, topY, 24, 'top'))
        elements.push(renderWallCabinet(cx, topY, 24, 'top'))
        cx += toPixels(24)
        
        // Base cabinet
        elements.push(renderBaseCabinet(cx, topY, 24, 'top'))
        elements.push(renderWallCabinet(cx, topY, 24, 'top'))
        cx += toPixels(24)
        
        // Range
        elements.push(renderRange(cx, topY, 30, 'top'))
        cx += toPixels(30)
        
        // End cabinet
        if (cx + toPixels(18) <= ox + roomWidthPx) {
          elements.push(renderBaseCabinet(cx, topY, 18, 'top'))
          elements.push(renderWallCabinet(cx, topY, 18, 'top'))
        }
        
        // Left run
        let cy = oy + baseCabinetPx
        const leftX = ox
        
        // Upper base cabinet
        elements.push(renderBaseCabinet(leftX, cy, 30, 'left'))
        elements.push(renderWallCabinet(leftX, cy, 30, 'left'))
        cy += toPixels(30)
        
        // Fridge
        elements.push(renderFridge(leftX, cy, 36, 30, 'left'))
        cy += toPixels(36)
        
        // Lower cabinet
        if (cy + toPixels(24) <= oy + roomDepthPx) {
          elements.push(renderBaseCabinet(leftX, cy, 24, 'left'))
          elements.push(renderWallCabinet(leftX, cy, 24, 'left'))
        }

        const sinkPos: [number, number] = [ox + toPixels(36 + 18), oy + baseCabinetPx / 2]
        const rangePos: [number, number] = [ox + toPixels(36 + 36 + 24 + 24 + 15), oy + baseCabinetPx / 2]
        const fridgePos: [number, number] = [ox + baseCabinetPx / 2, oy + baseCabinetPx + toPixels(30 + 18)]
        
        elements.push(renderWorkTriangle([sinkPos, rangePos, fridgePos], [
          calcDistance(sinkPos, rangePos),
          calcDistance(rangePos, fridgePos),
          calcDistance(fridgePos, sinkPos)
        ]))
        
        return <>{elements}</>
      }

      case "u-shaped": {
        const elements: React.ReactNode[] = []
        
        // Top run
        let cx = ox
        const topY = oy
        
        elements.push(renderBaseCabinet(cx, topY, 30, 'top'))
        elements.push(renderWallCabinet(cx, topY, 30, 'top'))
        cx += toPixels(30)
        
        elements.push(renderSink(cx, topY, 36, 'top'))
        cx += toPixels(36)
        
        elements.push(renderDishwasher(cx, topY, 24, 'top'))
        elements.push(renderWallCabinet(cx, topY, 24, 'top'))
        cx += toPixels(24)
        
        elements.push(renderBaseCabinet(cx, topY, 30, 'top'))
        elements.push(renderWallCabinet(cx, topY, 30, 'top'))
        
        // Left run
        let cy = oy + baseCabinetPx
        elements.push(renderBaseCabinet(ox, cy, 30, 'left'))
        elements.push(renderWallCabinet(ox, cy, 30, 'left'))
        cy += toPixels(30)
        
        elements.push(renderFridge(ox, cy, 36, 30, 'left'))
        cy += toPixels(36)
        
        elements.push(renderBaseCabinet(ox, cy, 24, 'left'))
        elements.push(renderWallCabinet(ox, cy, 24, 'left'))
        
        // Right run
        cy = oy + baseCabinetPx
        const rightX = ox + roomWidthPx - baseCabinetPx
        
        elements.push(renderBaseCabinet(rightX, cy, 24, 'right'))
        cy += toPixels(24)
        
        elements.push(renderRange(rightX, cy, 30, 'right'))
        cy += toPixels(30)
        
        elements.push(renderBaseCabinet(rightX, cy, 36, 'right'))

        const sinkPos: [number, number] = [ox + toPixels(30 + 18), oy + baseCabinetPx / 2]
        const rangePos: [number, number] = [ox + roomWidthPx - baseCabinetPx / 2, oy + baseCabinetPx + toPixels(24 + 15)]
        const fridgePos: [number, number] = [ox + baseCabinetPx / 2, oy + baseCabinetPx + toPixels(30 + 18)]
        
        elements.push(renderWorkTriangle([sinkPos, rangePos, fridgePos], [
          calcDistance(sinkPos, rangePos),
          calcDistance(rangePos, fridgePos),
          calcDistance(fridgePos, sinkPos)
        ]))
        
        return <>{elements}</>
      }

      case "galley": {
        const elements: React.ReactNode[] = []
        
        // Left run
        let cy = oy
        elements.push(renderBaseCabinet(ox, cy, 24, 'left'))
        elements.push(renderWallCabinet(ox, cy, 24, 'left'))
        cy += toPixels(24)
        
        elements.push(renderSink(ox, cy, 36, 'left'))
        cy += toPixels(36)
        
        elements.push(renderDishwasher(ox, cy, 24, 'left'))
        elements.push(renderWallCabinet(ox, cy, 24, 'left'))
        cy += toPixels(24)
        
        elements.push(renderRange(ox, cy, 30, 'left'))
        cy += toPixels(30)
        
        elements.push(renderBaseCabinet(ox, cy, 24, 'left'))
        elements.push(renderWallCabinet(ox, cy, 24, 'left'))
        
        // Right run
        cy = oy
        const rightX = ox + roomWidthPx - baseCabinetPx
        
        elements.push(renderBaseCabinet(rightX, cy, 36, 'right'))
        cy += toPixels(36)
        
        elements.push(renderFridge(rightX, cy, 36, 30, 'right'))
        cy += toPixels(36)
        
        elements.push(renderBaseCabinet(rightX, cy, 36, 'right'))
        cy += toPixels(36)
        
        elements.push(renderBaseCabinet(rightX, cy, 30, 'right'))

        const sinkPos: [number, number] = [ox + baseCabinetPx / 2, oy + toPixels(24 + 18)]
        const rangePos: [number, number] = [ox + baseCabinetPx / 2, oy + toPixels(24 + 36 + 24 + 15)]
        const fridgePos: [number, number] = [ox + roomWidthPx - baseCabinetPx / 2, oy + toPixels(36 + 18)]
        
        elements.push(renderWorkTriangle([sinkPos, rangePos, fridgePos], [
          calcDistance(sinkPos, rangePos),
          calcDistance(rangePos, fridgePos),
          calcDistance(fridgePos, sinkPos)
        ]))
        
        return <>{elements}</>
      }

      case "island": {
        const elements: React.ReactNode[] = []
        
        // Top run
        let cx = ox
        const topY = oy
        
        elements.push(renderFridge(cx, topY, 36, 30, 'top'))
        cx += toPixels(36)
        
        elements.push(renderBaseCabinet(cx, topY, 24, 'top'))
        elements.push(renderWallCabinet(cx, topY, 24, 'top'))
        cx += toPixels(24)
        
        elements.push(renderSink(cx, topY, 36, 'top'))
        cx += toPixels(36)
        
        elements.push(renderDishwasher(cx, topY, 24, 'top'))
        elements.push(renderWallCabinet(cx, topY, 24, 'top'))
        cx += toPixels(24)
        
        elements.push(renderBaseCabinet(cx, topY, 30, 'top'))
        elements.push(renderWallCabinet(cx, topY, 30, 'top'))
        
        // Island
        const islandWidthIn = Math.min(Math.floor(roomWidthIn * 0.4 / 6) * 6, 72) // Round to 6" increments
        const islandDepthIn = 36
        const islandX = ox + (roomWidthPx - toPixels(islandWidthIn)) / 2
        const islandY = oy + roomDepthPx * 0.55
        
        // Island body
        elements.push(
          <g key="island">
            <rect x={islandX} y={islandY} width={toPixels(islandWidthIn)} height={toPixels(islandDepthIn)} fill="#f7f3ed" stroke="#2d2d2d" strokeWidth={2} />
            <rect x={islandX + 4} y={islandY + 4} width={toPixels(islandWidthIn) - 8} height={toPixels(islandDepthIn) - 8} fill="none" stroke="#a09080" strokeWidth={1} />
            {/* Counter edge */}
            <line x1={islandX} y1={islandY + toPixels(islandDepthIn) - 2} x2={islandX + toPixels(islandWidthIn)} y2={islandY + toPixels(islandDepthIn) - 2} stroke="#b8a88a" strokeWidth={3} />
            {/* Seating stools */}
            {Array.from({ length: Math.floor(islandWidthIn / 24) }).map((_, i) => (
              <circle key={i} cx={islandX + toPixels(12 + i * 24)} cy={islandY + toPixels(islandDepthIn) + 20} r={14} fill="none" stroke="#888" strokeWidth={1.5} strokeDasharray="5 3" />
            ))}
            {/* Island dimension */}
            <text x={islandX + toPixels(islandWidthIn) / 2} y={islandY - 8} textAnchor="middle" fontSize={10} fontWeight={500} fill="#333">ISLAND {islandWidthIn}&quot; x {islandDepthIn}&quot;</text>
          </g>
        )
        
        // Cooktop on island
        elements.push(
          <g key="island-range">
            {renderRange(islandX + toPixels(islandWidthIn) / 2 - toPixels(15), islandY + 4, 30, 'top')}
          </g>
        )

        const sinkPos: [number, number] = [ox + toPixels(36 + 24 + 18), oy + baseCabinetPx / 2]
        const rangePos: [number, number] = [islandX + toPixels(islandWidthIn) / 2, islandY + toPixels(islandDepthIn) / 2]
        const fridgePos: [number, number] = [ox + toPixels(18), oy + baseCabinetPx / 2]
        
        elements.push(renderWorkTriangle([sinkPos, rangePos, fridgePos], [
          calcDistance(sinkPos, rangePos),
          calcDistance(rangePos, fridgePos),
          calcDistance(fridgePos, sinkPos)
        ]))
        
        return <>{elements}</>
      }

      case "single-wall": {
        const elements: React.ReactNode[] = []
        
        let cx = ox
        const topY = oy
        
        elements.push(renderFridge(cx, topY, 36, 30, 'top'))
        cx += toPixels(36)
        
        elements.push(renderBaseCabinet(cx, topY, 18, 'top'))
        elements.push(renderWallCabinet(cx, topY, 18, 'top'))
        cx += toPixels(18)
        
        elements.push(renderSink(cx, topY, 36, 'top'))
        cx += toPixels(36)
        
        elements.push(renderDishwasher(cx, topY, 24, 'top'))
        elements.push(renderWallCabinet(cx, topY, 24, 'top'))
        cx += toPixels(24)
        
        elements.push(renderRange(cx, topY, 30, 'top'))
        cx += toPixels(30)
        
        elements.push(renderBaseCabinet(cx, topY, 24, 'top'))
        elements.push(renderWallCabinet(cx, topY, 24, 'top'))

        const sinkPos: [number, number] = [ox + toPixels(36 + 18 + 18), oy + baseCabinetPx / 2]
        const rangePos: [number, number] = [ox + toPixels(36 + 18 + 36 + 24 + 15), oy + baseCabinetPx / 2]
        const fridgePos: [number, number] = [ox + toPixels(18), oy + baseCabinetPx / 2]
        
        elements.push(renderWorkTriangle([sinkPos, rangePos, fridgePos], [
          calcDistance(sinkPos, rangePos),
          calcDistance(rangePos, fridgePos),
          calcDistance(fridgePos, sinkPos)
        ]))
        
        return <>{elements}</>
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
        style={{ maxHeight: "600px" }}
      >
        <defs>
          {/* Grid pattern */}
          <pattern id="grid-1ft" width={toPixels(12)} height={toPixels(12)} patternUnits="userSpaceOnUse">
            <path d={`M ${toPixels(12)} 0 L 0 0 0 ${toPixels(12)}`} fill="none" stroke="#e0e0e0" strokeWidth={0.5} />
          </pattern>
          {/* Arrow markers */}
          <marker id="arrowL" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
            <path d="M8,0 L0,4 L8,8" fill="none" stroke="#444" strokeWidth="1" />
          </marker>
          <marker id="arrowR" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="none" stroke="#444" strokeWidth="1" />
          </marker>
          <marker id="arrowU" markerWidth="8" markerHeight="8" refX="4" refY="0" orient="auto">
            <path d="M0,8 L4,0 L8,8" fill="none" stroke="#444" strokeWidth="1" />
          </marker>
          <marker id="arrowD" markerWidth="8" markerHeight="8" refX="4" refY="8" orient="auto">
            <path d="M0,0 L4,8 L8,0" fill="none" stroke="#444" strokeWidth="1" />
          </marker>
        </defs>
        
        {/* Background grid */}
        <rect x={MARGIN} y={MARGIN} width={roomWidthPx} height={roomDepthPx} fill="url(#grid-1ft)" />
        
        {/* Room walls */}
        <rect x={MARGIN} y={MARGIN} width={roomWidthPx} height={roomDepthPx} fill="none" stroke="#1a1a1a" strokeWidth={6} />
        
        {/* Room dimensions */}
        {renderDimension(MARGIN, MARGIN + roomDepthPx, MARGIN + roomWidthPx, MARGIN + roomDepthPx, `${width}'-0"`, 35)}
        {renderDimension(MARGIN, MARGIN, MARGIN, MARGIN + roomDepthPx, `${depth}'-0"`, 35)}
        
        {/* Layout elements */}
        {renderLayout()}
        
        {/* Title block */}
        <g transform={`translate(${svgWidth - 130}, ${svgHeight - 60})`}>
          <rect x={0} y={0} width={120} height={55} fill="white" stroke="#1a1a1a" strokeWidth={1.5} />
          <line x1={0} y1={18} x2={120} y2={18} stroke="#1a1a1a" strokeWidth={0.5} />
          <line x1={0} y1={36} x2={120} y2={36} stroke="#1a1a1a" strokeWidth={0.5} />
          <text x={60} y={12} textAnchor="middle" fontSize={9} fontWeight={600} fill="#1a1a1a">KITCHEN FLOOR PLAN</text>
          <text x={60} y={29} textAnchor="middle" fontSize={8} fill="#555">SCALE: 1&quot; = 4&apos;-0&quot;</text>
          <text x={60} y={48} textAnchor="middle" fontSize={8} fill="#555">{layout.toUpperCase().replace('-', ' ')} LAYOUT</text>
        </g>
      </svg>

      {/* Legend */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
        <h4 className="text-sm font-medium mb-3 text-foreground">Floor Plan Legend (Top-Down View)</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="flex items-center gap-2">
            <svg width="36" height="24" viewBox="0 0 36 24">
              {/* Base cabinet top-down: rectangle with counter edge and door swing arc */}
              <rect x="2" y="2" width="32" height="18" fill="#f5f0e8" stroke="#2d2d2d" strokeWidth="1.5" />
              <line x1="2" y1="20" x2="34" y2="20" stroke="#8b7355" strokeWidth="3" />
              <path d="M 2 20 A 14 14 0 0 1 16 6" fill="none" stroke="#888" strokeWidth="0.75" strokeDasharray="3 2" />
            </svg>
            <div>
              <div className="text-xs font-medium">Base Cabinet</div>
              <div className="text-[10px] text-muted-foreground">24&quot; deep</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <svg width="36" height="20" viewBox="0 0 36 20">
              {/* Wall cabinet: dashed outline with X */}
              <rect x="2" y="2" width="32" height="16" fill="none" stroke="#666" strokeWidth="1.5" strokeDasharray="6 3" />
              <line x1="2" y1="2" x2="34" y2="18" stroke="#aaa" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="34" y1="2" x2="2" y2="18" stroke="#aaa" strokeWidth="0.5" strokeDasharray="3 3" />
            </svg>
            <div>
              <div className="text-xs font-medium">Wall Cabinet</div>
              <div className="text-[10px] text-muted-foreground">12&quot; deep (above)</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <svg width="36" height="24" viewBox="0 0 36 24">
              {/* Sink top-down: counter with two bowl cutouts and drains */}
              <rect x="2" y="2" width="32" height="18" fill="#f5f0e8" stroke="#2d2d2d" strokeWidth="1" />
              <line x1="2" y1="20" x2="34" y2="20" stroke="#8b7355" strokeWidth="3" />
              <rect x="5" y="5" width="11" height="10" fill="#e8e8e8" stroke="#555" strokeWidth="1" rx="2" />
              <rect x="20" y="5" width="11" height="10" fill="#e8e8e8" stroke="#555" strokeWidth="1" rx="2" />
              <circle cx="10.5" cy="10" r="2.5" fill="#333" />
              <circle cx="25.5" cy="10" r="2.5" fill="#333" />
            </svg>
            <div>
              <div className="text-xs font-medium">Sink</div>
              <div className="text-[10px] text-muted-foreground">36&quot; standard</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <svg width="32" height="24" viewBox="0 0 32 24">
              {/* Range top-down: dark surface with 4 circular burners */}
              <rect x="2" y="2" width="28" height="20" fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="1.5" />
              <circle cx="10" cy="8" r="4" fill="none" stroke="#666" strokeWidth="2" />
              <circle cx="22" cy="8" r="4" fill="none" stroke="#666" strokeWidth="2" />
              <circle cx="10" cy="16" r="4" fill="none" stroke="#666" strokeWidth="2" />
              <circle cx="22" cy="16" r="4" fill="none" stroke="#666" strokeWidth="2" />
              <circle cx="10" cy="8" r="1.5" fill="#444" />
              <circle cx="22" cy="8" r="1.5" fill="#444" />
              <circle cx="10" cy="16" r="1.5" fill="#444" />
              <circle cx="22" cy="16" r="1.5" fill="#444" />
            </svg>
            <div>
              <div className="text-xs font-medium">Range</div>
              <div className="text-[10px] text-muted-foreground">30&quot; standard</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <svg width="30" height="26" viewBox="0 0 30 26">
              {/* Refrigerator top-down: rectangle with X pattern */}
              <rect x="2" y="2" width="26" height="22" fill="#d0d0d0" stroke="#2d2d2d" strokeWidth="1.5" />
              <rect x="5" y="5" width="20" height="16" fill="none" stroke="#888" strokeWidth="1" />
              <line x1="5" y1="5" x2="25" y2="21" stroke="#999" strokeWidth="0.75" />
              <line x1="25" y1="5" x2="5" y2="21" stroke="#999" strokeWidth="0.75" />
              <rect x="10" y="9" width="10" height="8" fill="white" rx="1" />
              <text x="15" y="15" textAnchor="middle" fontSize="6" fontWeight="600" fill="#333">REF</text>
            </svg>
            <div>
              <div className="text-xs font-medium">Refrigerator</div>
              <div className="text-[10px] text-muted-foreground">36&quot;x30&quot;</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <svg width="28" height="24" viewBox="0 0 28 24">
              {/* Dishwasher top-down: rectangle with circle indicator */}
              <rect x="2" y="2" width="24" height="18" fill="#e0e0e0" stroke="#2d2d2d" strokeWidth="1" />
              <line x1="2" y1="20" x2="26" y2="20" stroke="#8b7355" strokeWidth="3" />
              <rect x="4" y="4" width="20" height="14" fill="none" stroke="#999" strokeWidth="1" />
              <circle cx="14" cy="11" r="5" fill="none" stroke="#888" strokeWidth="1" />
              <circle cx="14" cy="11" r="2" fill="#888" />
            </svg>
            <div>
              <div className="text-xs font-medium">Dishwasher</div>
              <div className="text-[10px] text-muted-foreground">24&quot; standard</div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border/30 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <svg width="40" height="12" viewBox="0 0 40 12">
              <line x1="2" y1="6" x2="38" y2="6" stroke="#3b82f6" strokeWidth="2" strokeDasharray="8 4" />
              <circle cx="20" cy="6" r="4" fill="#3b82f6" />
            </svg>
            <span>Work Triangle</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="24" height="12" viewBox="0 0 24 12">
              <line x1="2" y1="6" x2="22" y2="6" stroke="#8b7355" strokeWidth="4" />
            </svg>
            <span>Counter Edge</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="30" height="16" viewBox="0 0 30 16">
              <path d="M 2 14 A 12 12 0 0 1 14 2" fill="none" stroke="#888" strokeWidth="1" strokeDasharray="3 2" />
            </svg>
            <span>Door Swing</span>
          </div>
        </div>
      </div>
    </div>
  )
}
