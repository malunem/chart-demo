import type { ChartRef } from '../types'

type ChartCanvasProps = { ref: ChartRef; height: number; width: number }

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
        display: 'block'
      }}></canvas>
  )
}
