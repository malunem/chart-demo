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

  let height = 500
  let width = 800
  let margin = 20
  let innerHeight = height - margin * 2
  // let innerWidth = width - margin * 2

  const drawnPoints: ChartPoint[] = []
  const dataPoints: ChartPoint[] = []

  const dataBoundaries = useMemo(() => getDataBoundaries(lines), [lines])

  useEffect(() => {
    if (!chartRef.current || !lines) return

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    width = chartRef.current.clientWidth
    height = chartRef.current.clientHeight

    // margin should be wide enough to show labels on the left
    ctx.font = '1rem sans-serif'
    const { maxY } = dataBoundaries
    const dataLabelStep = getDataLabelStep(maxY)
    const label = formatLabelString({ dataLabelStep, i: 10 })
    margin = ctx.measureText(label + ' ').width
    innerWidth = Math.round((width - margin * 2) / 10) * 10
    innerHeight = Math.round((height - margin * 2) / 10) * 10

    scaleChart({ ctx, chartRef, width, height })

    ctx.lineWidth = 1
    ctx.strokeStyle = getCanvasBaseColor(theme)
    ctx.save()
    drawInnerBorder({ ctx, margin })
    drawBackgroundGrid({ ctx, dataBoundaries, theme })
    drawChartLines({
      ctx,
      margin,
      drawnPoints,
      dataPoints,
      lines,
      dataBoundaries,
      theme,
      innerHeight
    })
    ctx.restore()

    chartRef.current.addEventListener('pointermove', (e) => {
      findPointAndShowTooltip({ e, drawnPoints, dataPoints, setTooltip })
    })

    return () => ctx.clearRect(0, 0, width, height)
  }, [lines, theme])

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
