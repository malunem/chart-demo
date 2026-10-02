import { useEffect, useMemo, useRef } from 'react'
import { useChartData } from '../hooks/useChartData'
import { useLanguage } from '../hooks/useLanguage'
import { LABELS } from '../i18n'
import type { ChartData, ChartItem } from '../types'

const GRID_LINES = 10;

/**
 * Renders Chart Page
 */
export const ChartPage = () => {
  const lines = useChartData() as ChartData
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [lang] = useLanguage()

  const isLoading = !chartRef && !lines

  let height = 500;
  let width = 800;
  let margin = 20;
  let innerHeight = height - (margin * 2);
  let innerWidth = width - (margin * 2)
  const aspectRatio = window.innerWidth / window.innerHeight

  const dataBoundaries = useMemo(() => getDataBoundaries(lines), [lines])

  const normalizePoint = ({ x, y }: { x: number, y: number }) => {
    const { maxX, maxY, minY, minX } = dataBoundaries;

    const rangeX = maxX - minX || 1
    const rangeY = maxY - minY || 1

    const xScale = Math.abs(innerWidth / rangeX)
    const yScale = Math.abs(innerHeight / rangeY)

    return {
      x: (x - minX) * xScale,
      y: (y - minY) * yScale
    }
  }

  const cartesianToCanvas = ({ x, y }: { x: number, y: number }) => {
    return {
      x: x,
      y: innerHeight - y
    }
  }

  const drawLine = ({ ctx, line }: { ctx: CanvasRenderingContext2D, line: ChartItem }) => {
    if (!line) return;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = line.color;
    ctx.beginPath()
    line.points.forEach((line, i) => {

      const normalized = normalizePoint({ x: line.x, y: line.y });

      const { x, y } = cartesianToCanvas(normalized)

      if (i === 0) ctx.moveTo(x, y)
      ctx.lineTo(x, y)
    })

    ctx.stroke()
  }

  const drawXgrid = (ctx: CanvasRenderingContext2D) => {
    const xPointsDistance = Math.round(innerWidth / GRID_LINES);
    for (let i = 1; i <= GRID_LINES; i++) {
      const x = i * xPointsDistance;

      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, innerHeight)
      ctx.stroke()

      // labels
      const { maxX } = dataBoundaries;
      const label = ((Math.round(maxX / GRID_LINES / 10) * 10) * i).toString()
      ctx.save()
      ctx.scale(1, 1);
      ctx.font = '1rem sans-serif'
      ctx.strokeStyle = 'black';
      ctx.globalAlpha = 1;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(label, x, innerHeight + 2);
      ctx.restore()
    }
  }

  const drawYgrid = (ctx: CanvasRenderingContext2D) => {
    const yPointsDistance = Math.round(innerHeight / GRID_LINES);
    for (let i = 0; i <= GRID_LINES; i++) {
      const y = i * yPointsDistance;
      ctx.beginPath()
      ctx.moveTo(0, innerHeight - y)
      ctx.lineTo(innerWidth, innerHeight - y)
      ctx.stroke()

      // labels
      ctx.save()
      ctx.scale(1, 1);
      ctx.font = '1rem sans-serif'

      const { maxY } = dataBoundaries;
      const label = ((Math.round(maxY / GRID_LINES / 10) * 10) * i).toString()
      ctx.strokeStyle = 'black';
      ctx.globalAlpha = 1;
      ctx.textAlign = "right";
      i === 0 ? ctx.textBaseline = 'top' : ctx.textBaseline = "middle";
      ctx.fillText(label, - 2, innerHeight - y);
      ctx.restore()
    }
  }

  useEffect(() => {
    if (!chartRef.current || !lines) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    width = chartRef.current.clientWidth;
    height = chartRef.current.clientHeight;

    // margin should be wide enough to show labels on the left
    ctx.font = '1rem sans-serif'
    const { maxY } = dataBoundaries;
    margin = ctx.measureText((maxY).toString() + ' ').width;
    innerWidth = Math.round((width - margin * 2) / 10) * 10;
    innerHeight = Math.round((height - margin * 2) / 10) * 10;

    // scaled chart depending on device resolution
    const dpr = window.devicePixelRatio;
    chartRef.current.width = width * dpr;
    chartRef.current.height = height * dpr;
    ctx.scale(dpr, dpr);

    // inner rectangle border
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.save()
    ctx.translate(margin, margin)
    ctx.strokeRect(0, 0, innerWidth, innerHeight)

    // background grid
    ctx.strokeStyle = 'grey';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    drawXgrid(ctx);
    drawYgrid(ctx)

    // chart lines
    ctx.lineWidth = 3;
    ctx.globalAlpha = 1;
    lines.forEach(line => drawLine({ ctx, line }))
    ctx.restore()

    return () => ctx.clearRect(0, 0, width, height);

  }, [lines, chartRef.current])

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">{LABELS[lang].chart}</h1>
      </div>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border my-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <canvas id="chart" ref={chartRef}
          height={height} width={width}
          style={{
            // border: '1px solid black',
            marginBottom: '3rem',
            width: '90%',
            display: 'block',
            aspectRatio
          }}
        ></canvas >
      )}
    </>
  )
}

const getDataBoundaries = (lines: ChartData) => {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  lines?.forEach((line) => {
    line.points.forEach(({ x, y }) => {
      if (x > maxX) maxX = x
      if (x < minX) minX = x
      if (y > maxY) maxY = y
      if (y < minY) minY = y
    })
  })
  return { maxX, maxY, minY, minX }
}