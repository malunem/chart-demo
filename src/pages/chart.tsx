import { useEffect, useMemo, useRef } from 'react'
import { useChartData } from '../hooks/useChartData'
import { useLanguage } from '../hooks/useLanguage'
import { LABELS } from '../i18n'
import type { ChartData, ChartItem, ChartPoint } from '../types'

const GRID_LINES = 10;
const LEGEND_COLOR_SIZE = 15;
const LEGEND_ITEM_GAP = 2;

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

  let drawnPoints: ChartPoint[] = [];
  let dataPoints: ChartPoint[] = []

  const dataBoundaries = useMemo(() => getDataBoundaries(lines), [lines])

  const normalizePoint = ({ x, y }: { x: number, y: number }) => {
    const { maxX, maxY } = dataBoundaries;

    const xScale = innerWidth / maxX
    const yScale = innerHeight / maxY

    return {
      x: (x) * xScale,
      y: (y) * yScale
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
      if (i === 0) console.log({ normalized, x, y })

      // save drawn points and data points in arrays with same index to be used at hover to show tooltip 
      drawnPoints.push({ x: Math.round(x + margin), y: Math.round(y + margin) })
      dataPoints.push({ x: line.x, y: line.y })

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
      const dataLabelSteps = maxX / GRID_LINES
      const label = formatLabelString({ dataLabelStep: dataLabelSteps, i })

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
      const dataLabelStep = getDataLabelStep(maxY)
      const label = formatLabelString({ dataLabelStep, i })

      ctx.strokeStyle = 'black';
      ctx.globalAlpha = 1;
      ctx.textAlign = "right";
      i === 0 ? ctx.textBaseline = 'top' : ctx.textBaseline = "middle";
      ctx.fillText(label, - 2, innerHeight - y);
      ctx.restore()
    }
  }

  const drawLegendItem = ({ ctx, color, label, position }: { ctx: CanvasRenderingContext2D, color: string, label: string, position: number }) => {

    const x = position;
    const y = -margin / 1.5
    ctx.save()

    // coloured square
    ctx.fillStyle = color;
    ctx.fillRect(x, y, LEGEND_COLOR_SIZE, LEGEND_COLOR_SIZE)

    // label text
    ctx.font = '1rem sans-serif'
    ctx.fillStyle = 'black';
    const labelWidth = ctx.measureText(label + ' ').width;
    const textPosition = { x: x + LEGEND_COLOR_SIZE + LEGEND_ITEM_GAP, y: y + LEGEND_COLOR_SIZE }
    ctx.fillText(label, textPosition.x, textPosition.y)
    ctx.restore()
    const nextItemPosition = textPosition.x + labelWidth + LEGEND_ITEM_GAP
    return nextItemPosition
  }


  const formatLabelString = ({ dataLabelStep: dataLabelStep, i }: { dataLabelStep: number, i: number }) => {
    const order = Math.floor(Math.log10(dataLabelStep || 1));
    const magnitude = Math.pow(10, order);

    const labelValue = ((Math.round(dataLabelStep / magnitude) * magnitude) * i);

    let decimals = 0;
    if (dataLabelStep >= 1 || dataLabelStep === 0) {
      decimals = 0;
    } else if (dataLabelStep >= 0.1) {
      decimals = 1;
    } else if (dataLabelStep >= 0.01) {
      decimals = 2;
    } else {
      decimals = 3;
    }


    if (labelValue === 0) return '0'

    if (order > 4) {
      return new Intl.NumberFormat('en', { notation: 'scientific' }).format(labelValue)
    }
    if (decimals !== 0) {
      return labelValue.toFixed(decimals);
    }

    return Math.round(labelValue).toString();
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
    const dataLabelStep = getDataLabelStep(maxY)
    const label = formatLabelString({ dataLabelStep, i: 10 })
    margin = ctx.measureText(label + ' ').width;
    innerWidth = Math.round((width - margin * 2) / 10) * 10;
    innerHeight = Math.round((height - margin * 2) / 10) * 10;

    // scale chart depending on device resolution
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
    let nextLegendItemPosition = margin
    lines.forEach((line) => {
      drawLine({ ctx, line })

      nextLegendItemPosition = drawLegendItem({ ctx, color: line.color, label: line.name, position: nextLegendItemPosition })
    })

    ctx.fillRect(0, 350, 2, 2)
    ctx.restore()

    chartRef.current.addEventListener('mousemove', (e) => {
      const x = e.offsetX;
      const y = e.offsetY;

      const foundPointIndex = drawnPoints.findIndex(
        p => Math.abs(p.x - x) <= 5 && Math.abs(p.y - y) <= 5)
      if (
        foundPointIndex >= 0
      ) {
        const { x, y } = dataPoints[foundPointIndex]
        console.log('found!:', x, y);
      }
    });


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
            border: '1px solid black',
            marginBottom: '3rem',
            width: '100%',
            display: 'block',
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


const getDataLabelStep = (max: number) => {
  return max / GRID_LINES

}