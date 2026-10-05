import { useEffect, useMemo, useRef, useState } from 'react'
import { useChartData } from '../hooks/useChartData'
import { useLanguage } from '../hooks/useLanguage'
import { LABELS } from '../i18n'
import type { ChartData, ChartItem, ChartPoint } from '../types'
import { useTheme } from '../hooks/useTheme'
import { Tooltip, type TooltipProps } from '../components/tooltip'
import { ChartCanvas } from '../components/chartCanvas'
import { Loader } from '../components/loader'
import { PageTitle } from '../layout/pageTitle'
import { cartesianToCanvas, drawLine, drawLines as drawChartLines, findPointAndShowTooltip, getDataBoundaries, normalizePoint, drawBackgroundGrid, GRID_LINES, getDataLabelStep } from '../utils/canvas'
import { useCanvasBaseColor } from '../hooks/useCanvasBaseColors'



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

  const height = 500
  const width = 800
  let margin = 20
  let innerHeight = height - margin * 2
  let innerWidth = width - margin * 2

  const drawnPoints: ChartPoint[] = []
  const dataPoints: ChartPoint[] = []

  const dataBoundaries = useMemo(() => getDataBoundaries(lines), [lines])




  const formatLabelString = ({
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

  useEffect(() => {
    if (!chartRef.current || !lines) return

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    const width = chartRef.current.clientWidth
    const height = chartRef.current.clientHeight

    // margin should be wide enough to show labels on the left
    ctx.font = '1rem sans-serif'
    const { maxY } = dataBoundaries
    const dataLabelStep = getDataLabelStep(maxY)
    const label = formatLabelString({ dataLabelStep, i: 10 })
    margin = ctx.measureText(label + ' ').width
    innerWidth = Math.round((width - margin * 2) / 10) * 10
    innerHeight = Math.round((height - margin * 2) / 10) * 10

    // scale chart depending on device resolution
    const dpr = window.devicePixelRatio
    chartRef.current.width = width * dpr
    chartRef.current.height = height * dpr
    ctx.scale(dpr, dpr)

    // inner rectangle border
    ctx.lineWidth = 1
    ctx.strokeStyle = useCanvasBaseColor()
    ctx.save()
    ctx.translate(margin, margin)
    ctx.strokeRect(0, 0, innerWidth, innerHeight)

    // background grid
    drawBackgroundGrid({ ctx })

    drawChartLines({ ctx, margin, drawnPoints, dataPoints, lines, dataBoundaries })
    ctx.restore()

    chartRef.current.addEventListener('mousemove', (e) => {
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
          <ChartCanvas ref={chartRef} />
          <Tooltip {...tooltip} />
        </>
      )}
      { }
    </>
  )
}





