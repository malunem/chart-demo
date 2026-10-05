import { useEffect, useMemo, useRef, useState } from 'react'
import { useChartData } from '../hooks/useChartData'
import { useLanguage } from '../hooks/useLanguage'
import { LABELS } from '../i18n'
import type { ChartData, ChartPoint } from '../types'
import { useTheme } from '../hooks/useTheme'
import { Tooltip, type TooltipProps } from '../components/tooltip'
import { ChartCanvas } from '../components/chartCanvas'
import { Loader } from '../components/loader'
import { PageTitle } from '../layout/pageTitle'
import {
  drawLines as drawChartLines,
  findPointAndShowTooltip,
  getDataBoundaries,
  drawBackgroundGrid,
  getDataLabelStep,
  formatLabelString,
  scaleChart,
  drawInnerBorder,
  getCanvasBaseColor
} from '../utils/canvas'

/**
 * Renders Chart Page
 */
export const ChartPage = () => {
  const lines = useChartData() as ChartData
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [lang] = useLanguage()
  const [theme] = useTheme()
  const isLoading = !chartRef && !lines
  const [tooltip, setTooltip] = useState<TooltipProps>({ show: false })

  const [height, setHeight] = useState(500)
  const [width, setWidth] = useState(800)

  const dataBoundaries = useMemo(() => getDataBoundaries(lines), [lines])

  useEffect(() => {
    const drawnPoints: ChartPoint[] = []
    const dataPoints: ChartPoint[] = []

    const canvas = chartRef.current
    if (!canvas || !lines) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.clientWidth
    const height = canvas.clientHeight
    setWidth(width)
    setHeight(height)

    // margin should be wide enough to show labels on the left
    ctx.font = '1rem sans-serif'
    const { maxY } = dataBoundaries
    const dataLabelStep = getDataLabelStep(maxY)
    const label = formatLabelString({ dataLabelStep, i: 10 })
    const margin = ctx.measureText(label + ' ').width
    const innerWidth = Math.round((width - margin * 2) / 10) * 10
    const innerHeight = Math.round((height - margin * 2) / 10) * 10

    scaleChart({ ctx, chartRef, width, height })

    ctx.lineWidth = 1
    ctx.strokeStyle = getCanvasBaseColor(theme)
    ctx.save()
    drawInnerBorder({ ctx, margin, innerWidth, innerHeight })
    drawBackgroundGrid({ ctx, dataBoundaries, theme, innerWidth, innerHeight })
    drawChartLines({
      ctx,
      margin,
      drawnPoints,
      dataPoints,
      lines,
      dataBoundaries,
      theme,
      innerHeight,
      innerWidth
    })
    ctx.restore()

    /**
     * Finds the hovered point, if any, and trigger tooltip to render
     */
    const handlePointerMove = (e: PointerEvent) => {
      findPointAndShowTooltip({ e, drawnPoints, dataPoints, setTooltip })
    }
    canvas.addEventListener('pointermove', handlePointerMove)

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove)
      ctx.clearRect(0, 0, width, height)
    }
  }, [lines, theme, width, height, dataBoundaries])

  return (
    <>
      <PageTitle title={LABELS[lang].chart} />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <ChartCanvas ref={chartRef} height={height} width={width} />
          <Tooltip {...tooltip} />
        </>
      )}
      {}
    </>
  )
}
