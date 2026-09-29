import { useEffect, useState } from 'react'
import type { ChartData, ChartDataResponse } from '../types'

/**
 * Fetches and returns JSON chart data from endpoint /api/chart-data/
 */
export function useChartData() {
  const [data, setData] = useState<ChartData | null>(null)

  useEffect(() => {

    /**
     * Fetches the response and stores its `items` array
     */
    async function fetchChartData() {
      try {
        const response = await fetch('/api/chart-data/')
        const data = (await response.json()) as ChartDataResponse

        setData(data.items)
      } catch (err) {
        throw new Error(`Error fetching chart-data: ${err}`)
      }
    }

    fetchChartData()
  }, [])

  return data
}
