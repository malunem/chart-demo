import { useEffect } from 'react'
import type { ChartDataResponse } from '../types'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setData } from '../store/dataSlice'

/**
 * Fetches and returns JSON chart data from endpoint /api/chart-data/
 */
export function useChartData() {
  const { value: data } = useAppSelector((state) => state.data)
  const dispatch = useAppDispatch()

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
        throw new Error(`Error fetching chart-data: ${err}`)
      }
    }

    if (!data) {
      fetchChartData()
    }
  }, [data, dispatch])

  return data
}
