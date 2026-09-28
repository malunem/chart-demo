import { createSlice } from '@reduxjs/toolkit'

export type Theme = 'light' | 'dark'
type ThemeState = {
  value: Theme
}

const initialState: ThemeState = { value: 'light' }
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggle: state => {
      if (state.value === 'light') state.value = 'dark'
      if (state.value === 'dark') state.value = 'light'
    }
  }
})

export const { toggle } = themeSlice.actions
export default themeSlice.reducer
