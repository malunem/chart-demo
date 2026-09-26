import type { ChartItem } from "../types";

export function drawLine({ ctx, line, xScale, yScale }: { ctx: CanvasRenderingContext2D, line: ChartItem, xScale: number, yScale: number }) {
  if (!line) return;
  
  ctx.strokeStyle = line.color;
  ctx.beginPath()

  line.points.forEach(({ x, y }, i) => {
    if (i === 0) ctx.moveTo(x * xScale, y * yScale)
    ctx.lineTo(x * xScale, y * yScale)
  })

  ctx.stroke()

}