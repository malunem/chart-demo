import type { Dispatch, SetStateAction } from "react"
import type { TooltipProps } from "../components/tooltip"
import type { ChartData, ChartItem, ChartPoint, DataBoundaries } from "../types"

export const GRID_LINES = 10
const LEGEND_COLOR_SIZE = 15
const LEGEND_ITEM_GAP = 2

/**
* Largest `x` and `y` across every series to identify the top value of both axes
* @param lines all series with their points
* @returns `maxX` and `maxY`, both `0` when `lines` is empty or `null`.
*/
export const getDataBoundaries = (lines: ChartData): DataBoundaries => {
  if (!lines?.length) return { maxX: 0, maxY: 0 }

  let maxX = -Infinity,
    maxY = -Infinity
  lines.forEach((line) => {
    line.points.forEach(({ x, y }) => {
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    })
  })
  return {
    maxX,
    maxY
  }
}

export const normalizePoint = ({ x, y, dataBoundaries }: { x: number; y: number, dataBoundaries: DataBoundaries }) => {
  const { maxX, maxY } = dataBoundaries

  const xScale = innerWidth / maxX
  const yScale = innerHeight / maxY

  return {
    x: x * xScale,
    y: y * yScale
  }
}

export const cartesianToCanvas = ({ x, y, innerHeight }: { x: number; y: number, innerHeight: number }) => {
  return {
    x: x,
    y: innerHeight - y
  }
}

type DrawLineProps = {
  ctx: CanvasRenderingContext2D; line: ChartItem, dataBoundaries: DataBoundaries,
  drawnPoints: ChartPoint[],
  dataPoints: ChartPoint[],
  margin: number
}

export const drawLine = ({ ctx, line, dataBoundaries, drawnPoints, dataPoints, margin }: DrawLineProps) => {
  if (!line) return
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.strokeStyle = line.color
  ctx.beginPath()

  line.points.forEach((line, i) => {
    const normalized = normalizePoint({ x: line.x, y: line.y, dataBoundaries })
    const { x, y } = cartesianToCanvas({ ...normalized, innerHeight })

    // save drawn points and data points in arrays with same index to be used at hover to show tooltip
    drawnPoints.push({ x: Math.round(x + margin), y: Math.round(y + margin) })
    dataPoints.push({ x: line.x, y: line.y })

    if (i === 0) ctx.moveTo(x, y)
    ctx.lineTo(x, y)
  })

  ctx.stroke()
}

type FindPointAndShowTooltipProps = {
  e: MouseEvent,
  drawnPoints: ChartPoint[],
  dataPoints: ChartPoint[],
  setTooltip: Dispatch<SetStateAction<TooltipProps>>
}

export const findPointAndShowTooltip = ({ e, drawnPoints, dataPoints, setTooltip }: FindPointAndShowTooltipProps) => {
  const x = e.offsetX
  const y = e.offsetY

  const foundPointIndex = drawnPoints.findIndex(
    (p) => Math.abs(p.x - x) <= 5 && Math.abs(p.y - y) <= 5
  )
  if (foundPointIndex >= 0) {
    const { x, y } = dataPoints[foundPointIndex]
    setTooltip({ show: true, left: e.clientX, top: e.clientY, x, y })
  } else {
    setTooltip({
      show: false,
      x: undefined,
      y: undefined,
      top: undefined,
      left: undefined
    })
  }
}

type DrawLegendItemProps = {
  ctx: CanvasRenderingContext2D
  color: string
  label: string
  position: number
  margin: number
}
const drawLegendItem = ({
  ctx,
  color,
  label,
  position,
  margin
}: DrawLegendItemProps) => {



  const x = position
  const y = -margin / 1.5
  ctx.save()

  // coloured square
  ctx.fillStyle = color
  ctx.fillRect(x, y, LEGEND_COLOR_SIZE, LEGEND_COLOR_SIZE)

  // label text
  ctx.font = '1rem sans-serif'
  ctx.fillStyle = useCanvasBaseColor()
  const labelWidth = ctx.measureText(label + ' ').width
  const textPosition = { x: x + LEGEND_COLOR_SIZE + LEGEND_ITEM_GAP, y: y + LEGEND_COLOR_SIZE }
  ctx.fillText(label, textPosition.x, textPosition.y)
  ctx.restore()
  const nextItemPosition = textPosition.x + labelWidth + LEGEND_ITEM_GAP
  return nextItemPosition
}


interface DrawLinesProps extends Omit<DrawLineProps, 'line'> {
  lines: ChartData
}

export const drawLines = ({ ctx, lines, margin, dataBoundaries, drawnPoints, dataPoints }: DrawLinesProps) => {
  ctx.lineWidth = 3
  ctx.globalAlpha = 1
  let nextLegendItemPosition = margin
  lines.forEach((line) => {
    drawLine({ ctx, line, dataBoundaries, drawnPoints, dataPoints, margin })

    nextLegendItemPosition = drawLegendItem({
      ctx,
      color: line.color,
      label: line.name,
      position: nextLegendItemPosition
    })
  })
}


const drawXgrid = (ctx: CanvasRenderingContext2D) => {
  const xPointsDistance = Math.round(innerWidth / GRID_LINES)
  for (let i = 1; i <= GRID_LINES; i++) {
    const x = i * xPointsDistance

    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, innerHeight)
    ctx.stroke()

    // labels
    const { maxX } = dataBoundaries
    const dataLabelSteps = maxX / GRID_LINES
    const label = formatLabelString({ dataLabelStep: dataLabelSteps, i })

    ctx.save()
    ctx.scale(1, 1)
    ctx.font = '1rem sans-serif'
    ctx.fillStyle = useCanvasBaseColor()
    ctx.globalAlpha = 1
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(label, x, innerHeight + 2)
    ctx.restore()
  }
}

const drawYgrid = (ctx: CanvasRenderingContext2D) => {

  const yPointsDistance = Math.round(innerHeight / GRID_LINES)
  for (let i = 0; i <= GRID_LINES; i++) {
    const y = i * yPointsDistance
    ctx.beginPath()
    ctx.moveTo(0, innerHeight - y)
    ctx.lineTo(innerWidth, innerHeight - y)
    ctx.stroke()

    // labels
    ctx.save()
    ctx.scale(1, 1)
    ctx.font = '1rem sans-serif'

    const { maxY } = dataBoundaries
    const dataLabelStep = getDataLabelStep(maxY)
    const label = formatLabelString({ dataLabelStep, i })
    ctx.fillStyle = useCanvasBaseColor()
    ctx.globalAlpha = 1
    ctx.textAlign = 'right'
    i === 0 ? (ctx.textBaseline = 'top') : (ctx.textBaseline = 'middle')
    ctx.fillText(label, -2, innerHeight - y)
    ctx.restore()
  }
}


export const drawBackgroundGrid = ({ ctx }) => {
  ctx.strokeStyle = 'grey'
  ctx.lineWidth = 1
  ctx.globalAlpha = 0.5
  drawXgrid(ctx)
  drawYgrid(ctx)
}

/**
* /**
* Spacing between grid lines: `max` split into `GRID_LINES` equal parts.
* @param max top of the axis range
* @returns the step distance between grid lines
*/
export const getDataLabelStep = (max: number) => {
  return max / GRID_LINES
}
