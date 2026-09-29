import { createSlice } from '@reduxjs/toolkit'
import type { Theme } from '../types'

type ThemeState = {
  value: Theme
}

const initialState: ThemeState = { value: 'light' }
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggle: (state) => {
      if (state.value === 'light') {
        state.value = 'dark'
      } else {
        state.value = 'light'
      }
    }
  }
})

export const { toggle } = themeSlice.actions
export default themeSlice.reducer
