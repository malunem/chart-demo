import { useEffect, useRef, useState } from "react";
import { useChartData } from "../hooks/useChartData";

export const LineChart = () => {
  const lines = useChartData();
  const [isReady, setReady] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.Chart) {
      setReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';

    const handleLoad = () => setReady(true);

    script.onload = handleLoad;
    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !lines) return;
    if (!window.Chart) return;

    const chart = new window.Chart(chartRef.current, {
      type: 'line',
      data: {
        datasets: lines.map(line => {
          return {
            label: line.name,
            data: line.points.map(point => {
              return { x: point.x, y: point.y }
            })
          }
        })
      }, options: {
        responsive: true,
        scales: {
          x: {
            type: 'linear'
          }
        }
      }
    });

    return () => chart.destroy();

  }, [lines, isReady,])



  return (
    <>
      <div>
        <div>Chart Page</div>
        <canvas id="chart" ref={chartRef}></canvas>
      </div >
    </>
  )
}