import type { ChartRef } from '../types'

type ChartCanvasProps = { ref: ChartRef; height: number; width: number }

/**
 * Renders html canvas as the chart's drawing surface
 */
export const ChartCanvas = ({ ref, height, width }: ChartCanvasProps) => {
  return (
    <canvas
      id="chart"
      ref={ref}
      height={height}
      width={width}
      style={{
        marginBottom: '3rem',
        width: '100%',
        maxHeight: '90vh',
        display: 'block',
        touchAction: 'none'
      }}></canvas>
  )
}
