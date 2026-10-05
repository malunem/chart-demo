export type ChartPoint = {
  x: number
  y: number
}

export type ChartItem = {
  name: string
  color: string
  points: ChartPoint[]
}

export type ChartData = ChartItem[]

export type ChartDataResponse = {
  status: 'OK' | unknown
  items: ChartData
}

export type Theme = 'light' | 'dark'

export type Language = 'en' | 'it'

export type DataBoundaries = {
  maxX: number
  maxY: number
}