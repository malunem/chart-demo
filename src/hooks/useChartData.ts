import { useEffect, useState } from 'react'
import type { ChartData, ChartDataResponse } from '../types'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setData } from '../store/dataSlice'

/**
 * Fetches and returns JSON chart data from endpoint /api/chart-data/
 */
export function useChartData() {
  const { value: data } = useAppSelector((state) => state.data)
  const dispatch = useAppDispatch()
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    /**
     * Fetches the response and stores its `items` array
     */
    async function fetchChartData() {
      try {
        const response = await fetch('/api/chart-data/')
        const data = (await response.json()) as ChartDataResponse

        dispatch(setData({ value: data.items }))
      } catch (err) {
        setError(new Error(`Error fetching chart-data: ${err}`))
      }
    }

    if (!data) {
      fetchChartData()
    }
  }, [data, dispatch])

  if (error) {
    return error
  }

  return data
}

/**
 * Test function
 * @param data 
 * @param factor 
 * @returns 
 */
function _scalePoints(data: ChartData, factor: number) {
  return data.map((line) => ({
    ...line,
    points: line.points.map((p, i) => ({
      ...p,
      x: p.x * factor * Math.pow(10, i),
      y: p.y * factor * i
    }))
  }));
}

