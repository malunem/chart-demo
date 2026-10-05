import type { Dispatch, SetStateAction } from 'react'
import type { TooltipProps } from '../components/tooltip'
import type { ChartData, ChartItem, ChartPoint, ChartRef, DataBoundaries, Theme } from '../types'

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

/**
 * Maps the data point coordinates to the space available in the canvas
 */
export const scaleDataPointToPixel = ({
  x,
  y,
  dataBoundaries,
  innerWidth,
  innerHeight
}: {
  x: number
  y: number
  dataBoundaries: DataBoundaries
  innerWidth: number
  innerHeight: number
}): ChartPoint => {
  const { maxX, maxY } = dataBoundaries

  const xScale = innerWidth / maxX
  const yScale = innerHeight / maxY

  return {
    x: x * xScale,
    y: y * yScale
  }
}

/**
 * The cartesian axes origin is bottom left, whilst the canvas origin is top left. Flips `y` around `innerHeight` and returns the point, with `x` unchanged 
 */
export const cartesianToCanvas = ({
  x,
  y,
  innerHeight
}: {
  x: number
  y: number
  innerHeight: number
}): ChartPoint => {
  return {
    x: x,
    y: innerHeight - y
  }
}

type DrawLineParams = {
  ctx: CanvasRenderingContext2D
  line: ChartItem
  dataBoundaries: DataBoundaries
  drawnPoints: ChartPoint[]
  dataPoints: ChartPoint[]
  margin: number
  theme: Theme
  innerHeight: number
  innerWidth: number
}

/**
 * Draws a line by iterating all of its points, using the line color.
 * Pushes each point in `drawnPoints` and `dataPoints` arrays (same index in both) for the hover tooltip.
 */
export const drawLine = ({
  ctx,
  line,
  dataBoundaries,
  drawnPoints,
  dataPoints,
  margin,
  innerHeight,
  innerWidth
}: DrawLineParams) => {
  if (!line) return
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.strokeStyle = line.color
  ctx.beginPath()

  line.points.forEach((line, i) => {
    const normalized = scaleDataPointToPixel({
      x: line.x,
      y: line.y,
      dataBoundaries,
      innerWidth,
      innerHeight
    })
    const { x, y } = cartesianToCanvas({ ...normalized, innerHeight })

    // save drawn points and data points in arrays with same index to be used at hover to show tooltip
    drawnPoints.push({ x: Math.round(x + margin), y: Math.round(y + margin) })
    dataPoints.push({ x: line.x, y: line.y })

    if (i === 0) ctx.moveTo(x, y)
    ctx.lineTo(x, y)
  })

  ctx.stroke()
}

type FindPointAndShowTooltipParams = {
  e: MouseEvent
  drawnPoints: ChartPoint[]
  dataPoints: ChartPoint[]
  setTooltip: Dispatch<SetStateAction<TooltipProps>>
}

/**
 * Looks for the hovered point, and if found within 5px of the pointer, builds and sets the tooltip props. Otherwise sets `{show: false}`.
 */
export const findPointAndShowTooltip = ({
  e,
  drawnPoints,
  dataPoints,
  setTooltip
}: FindPointAndShowTooltipParams) => {
  const x = e.offsetX
  const y = e.offsetY

  const foundPointIndex = drawnPoints.findIndex(
    (p) => Math.abs(p.x - x) <= 5 && Math.abs(p.y - y) <= 5
  )
  if (foundPointIndex >= 0) {
    const { x, y } = dataPoints[foundPointIndex]
    setTooltip({ show: true, left: e.pageX, top: e.pageY, x, y })
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

type DrawLegendItemParams = {
  ctx: CanvasRenderingContext2D
  color: string
  label: string
  position: number
  margin: number
  theme: Theme
}
const drawLegendItem = ({ ctx, color, label, position, margin, theme }: DrawLegendItemParams) => {
  const x = position
  const y = -margin / 1.5
  ctx.save()

  // coloured square
  ctx.fillStyle = color
  ctx.fillRect(x, y, LEGEND_COLOR_SIZE, LEGEND_COLOR_SIZE)

  // label text
  ctx.font = '1rem sans-serif'
  ctx.fillStyle = getCanvasBaseColor(theme)
  const labelWidth = ctx.measureText(label + ' ').width
  const textPosition = { x: x + LEGEND_COLOR_SIZE + LEGEND_ITEM_GAP, y: y + LEGEND_COLOR_SIZE }
  ctx.fillText(label, textPosition.x, textPosition.y)
  ctx.restore()
  const nextItemPosition = textPosition.x + labelWidth + LEGEND_ITEM_GAP
  return nextItemPosition
}

interface DrawLinesParams extends Omit<DrawLineParams, 'line'> {
  lines: ChartData
}

export const drawLines = ({
  ctx,
  lines,
  margin,
  dataBoundaries,
  drawnPoints,
  dataPoints,
  theme,
  innerHeight,
  innerWidth
}: DrawLinesParams) => {
  ctx.lineWidth = 3
  ctx.globalAlpha = 1
  let nextLegendItemPosition = margin
  lines.forEach((line) => {
    drawLine({
      ctx,
      line,
      dataBoundaries,
      drawnPoints,
      dataPoints,
      margin,
      theme,
      innerHeight,
      innerWidth
    })

    nextLegendItemPosition = drawLegendItem({
      ctx,
      color: line.color,
      label: line.name,
      position: nextLegendItemPosition,
      margin,
      theme
    })
  })
}

export const formatLabelString = ({
  dataLabelStep: dataLabelStep,
  i
}: {
  dataLabelStep: number
  i: number
}) => {
  const order = Math.floor(Math.log10(dataLabelStep || 1))
  const magnitude = Math.pow(10, order)

  const labelValue = Math.round(dataLabelStep / magnitude) * magnitude * i

  let decimals = 0
  if (dataLabelStep >= 1 || dataLabelStep === 0) {
    decimals = 0
  } else if (dataLabelStep >= 0.1) {
    decimals = 1
  } else if (dataLabelStep >= 0.01) {
    decimals = 2
  } else {
    decimals = 3
  }

  if (labelValue === 0) return '0'

  if (order > 4) {
    return new Intl.NumberFormat('en', { notation: 'scientific' }).format(labelValue)
  }
  if (decimals !== 0) {
    return labelValue.toFixed(decimals)
  }

  return Math.round(labelValue).toString()
}

type DrawGridParams = {
  ctx: CanvasRenderingContext2D
  dataBoundaries: DataBoundaries
  theme: Theme
  innerWidth: number
  innerHeight: number
}

const drawXgrid = ({ ctx, dataBoundaries, theme, innerWidth, innerHeight }: DrawGridParams) => {
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
    ctx.fillStyle = getCanvasBaseColor(theme)
    ctx.globalAlpha = 1
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(label, x, innerHeight + 2)
    ctx.restore()
  }
}

const drawYgrid = ({ ctx, dataBoundaries, theme, innerWidth, innerHeight }: DrawGridParams) => {
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
    ctx.fillStyle = getCanvasBaseColor(theme)
    ctx.globalAlpha = 1
    ctx.textAlign = 'right'
    ctx.textBaseline = i === 0 ? 'top' : 'middle'
    ctx.fillText(label, -2, innerHeight - y)
    ctx.restore()
  }
}

export const drawBackgroundGrid = ({
  ctx,
  dataBoundaries,
  theme,
  innerWidth,
  innerHeight
}: DrawGridParams) => {
  ctx.strokeStyle = 'grey'
  ctx.lineWidth = 1
  ctx.globalAlpha = 0.5
  drawXgrid({ ctx, dataBoundaries, theme, innerWidth, innerHeight })
  drawYgrid({ ctx, dataBoundaries, theme, innerWidth, innerHeight })
}

/**
 * Spacing between grid lines: `max` split into `GRID_LINES` equal parts.
 * @param max top of the axis range
 * @returns the step distance between grid lines
 */
export const getDataLabelStep = (max: number) => {
  return max / GRID_LINES
}

type ScaleChartParams = {
  ctx: CanvasRenderingContext2D
  chartRef: ChartRef
  width: number
  height: number
}

/**
 * Scale chart depending on device resolution
 * @param param0
 */
export const scaleChart = ({ ctx, chartRef, width, height }: ScaleChartParams) => {
  const dpr = window.devicePixelRatio
  if (chartRef.current) {
    chartRef.current.width = width * dpr
    chartRef.current.height = height * dpr
  }
  ctx.scale(dpr, dpr)
}

/**
 * Draws the chart inner border leaving space on the sides for labels and legend
 */
export const drawInnerBorder = ({
  ctx,
  margin,
  innerWidth,
  innerHeight
}: {
  ctx: CanvasRenderingContext2D
  margin: number
  innerWidth: number
  innerHeight: number
}) => {
  ctx.translate(margin, margin)
  ctx.strokeRect(0, 0, innerWidth, innerHeight)
}

export const getCanvasBaseColor = (theme: Theme) => {
  return theme === 'light' ? 'black' : 'white'
}
