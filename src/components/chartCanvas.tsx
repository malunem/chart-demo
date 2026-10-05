import type { RefObject } from "react"

export const ChartCanvas = ({ ref }: { ref: RefObject<HTMLCanvasElement | null> }) => {
  return <canvas
    id="chart"
    ref={ref}
    style={{
      marginBottom: '3rem',
      width: '100%',
      display: 'block'
    }}></canvas>
}