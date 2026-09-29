import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './themeSlice'
import languageReducer from './languageSlice'
import dataReducer from './dataSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
    data: dataReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
