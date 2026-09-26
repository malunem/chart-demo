import { useEffect, useRef } from "react";
import { useChartData } from "../hooks/useChartData";
import { drawLine } from "../utils/canvas-helpers";

// const Chart = { window }

export const LineChart = () => {

  const height = 500;
  const width = 800;
  const lines = useChartData();

  const chartRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!chartRef.current || !lines) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    let maxY: number = lines[0].points[0].y
    let maxX: number = lines[0].points[0].x
    let minY: number = lines[0].points[0].y
    let minX: number = lines[0].points[0].x

    lines.forEach((line) => {
      line.points.forEach(({ x, y }) => {
        if (x > maxX) maxX = x
        if (x < minX) minX = x
        if (y > maxY) maxY = y
        if (y < minY) minY = y
      })
    })

    const rangeX = maxX - minX
    const rangeY = maxY - minY

    const xScale = width / rangeX
    const yScale = height / rangeY

    lines.forEach((line) => drawLine({ ctx, line, xScale, yScale }))

    // return () => Chart.destroy;

  }, [lines])



  return (
    <>
      <div>
        <div>Chart Page</div>
        <canvas id="chart" ref={chartRef} height={height} width={width} style={{ border: '1px solid black' }}></canvas>
      </div >
      {/* <script async src="https://cdn.jsdelivr.net/npm/chart.js"></script> */}

    </>
  )
}