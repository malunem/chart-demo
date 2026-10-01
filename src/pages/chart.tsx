import { useEffect, useMemo, useRef } from 'react'
import { useChartData } from '../hooks/useChartData'
import { useLanguage } from '../hooks/useLanguage'
import { LABELS } from '../i18n'
import type { ChartData, ChartItem } from '../types'

/**
 * Renders Chart Page
 */
export const ChartPage = () => {
  const lines = useChartData() as ChartData
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [lang] = useLanguage()

  const isLoading = !chartRef && !lines

  const height = 500;
  const width = 800;
  const margin = 20;
  const innerHeight = height - (margin * 2);
  const innerWidth = width - (margin * 2)

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
      x: x ,
      y: innerHeight - y 
    }
  }

  const drawLine = ({ ctx, line }: { ctx: CanvasRenderingContext2D, line: ChartItem }) => {
    if (!line) return;


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
    const xPointsDistance = innerWidth / 10;
    for (let x = xPointsDistance; x <= innerWidth; x += xPointsDistance) {
      ctx.beginPath()
      ctx.moveTo(x , 0)
      ctx.lineTo(x , innerHeight )
      ctx.stroke()

      // labels
      const { maxX } = dataBoundaries;
      const label = ((maxX * x) / innerWidth).toString()
      ctx.save()
      ctx.strokeStyle = 'black';
      ctx.globalAlpha = 1;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(label, x , innerHeight  + 2);
      ctx.restore()
    }
  }

  const drawYgrid = (ctx: CanvasRenderingContext2D) => {
    const yPointsDistance = innerHeight / 10;
    console.log({ yPointsDistance, netHeight: innerHeight })
    for (let y = yPointsDistance; y <= innerHeight; y += yPointsDistance) {

      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(innerWidth, y)
      ctx.stroke()

      // labels
      ctx.save()
      const { maxY } = dataBoundaries;
      const label = ((maxY * y) / innerHeight).toString()
      ctx.strokeStyle = 'black';
      ctx.globalAlpha = 1;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(label,  - 2, innerHeight - y );
      ctx.restore()
    }
  }

  useEffect(() => {
    if (!chartRef.current || !lines) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

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

  }, [lines, chartRef])

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
        <canvas id="chart" ref={chartRef} height={height} width={width}
          // style={{ border: '1px solid black' }}
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