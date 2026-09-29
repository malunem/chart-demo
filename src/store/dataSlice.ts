import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ChartData } from '../types'

type DataState = {
  value: ChartData | null
}

const initialState: DataState = { value: null }
const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<DataState>) => {
      state.value = action.payload.value
    }
  }
})

export const { setData } = dataSlice.actions
export default dataSlice.reducer
