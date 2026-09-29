import { useEffect, useRef, useState } from 'react'
import { useChartData } from '../hooks/useChartData'
import { useLanguage } from '../hooks/useLanguage'
import { LABELS } from '../i18n'

/**
 * Renders Chart Page
 */
export const ChartPage = () => {
  const lines = useChartData()
  const [isReady, setReady] = useState(false)
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [lang] = useLanguage()



  useEffect(() => {
    if (window.Chart) {
      return;
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js'

    /**
     * Sets Ready state when Chart.JS script is loaded so chart can be rendered correctly
     */
    const handleLoad = () => setReady(true)

    script.onload = handleLoad
    document.head.appendChild(script)

    return () => {
      script.removeEventListener('load', handleLoad)
    }
  }, [])

  useEffect(() => {
    if (!chartRef.current || !lines) return
    if (!window.Chart) return

    const chart = new window.Chart(chartRef.current, {
      type: 'line',
      data: {
        datasets: lines.map((line) => {
          return {
            label: line.name,
            data: line.points.map((point) => {
              return { x: point.x, y: point.y }
            })
          }
        })
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'linear'
          }
        }
      }
    })

    return () => chart.destroy()
  }, [lines, isReady])

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">{LABELS[lang].chart}</h1>
        {/* <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary">
              Export
            </button>
          </div>
        </div> */}
      </div>
      <canvas id="chart" ref={chartRef}></canvas>
    </>
  )
}
