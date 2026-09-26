import React, { useEffect } from 'react';

export type ChartPoint = {
  x: number;
  y: number;
}

export type ChartItem = {
  name: string;
  color: string;
  points: ChartPoint[]
};

export type ChartData = ChartItem[];

export type ChartDataResponse = {
  status: 'OK' | unknown;
  items: ChartData;
}

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