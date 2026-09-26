import React, { useEffect } from 'react';
import type { ChartData, ChartDataResponse } from '../types';



export function useChartData() {
  const [data, setData] = React.useState<ChartData | null>(null);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await fetch('/api/chart-data/');
        const data = await response.json() as ChartDataResponse;
  
        setData(data.items)
      } catch (err) {
        console.error(err)
      }
    }

    fetchChartData();
  }, []);

  return data;
}