import { useChartData } from "../hooks/useChartData";

export const Chart = () => {

  const data = useChartData();
  console.log({data})

  return (
    <div>
      <div>Chart Page</div>
      <canvas id="chart"></canvas>
    </div>
  )
}