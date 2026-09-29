import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Language } from '../types'

type LanguageState = {
  value: Language
  label: string
}

type LanguageOptions = { [L in Language]: LanguageState }

export const LANGUAGES: LanguageOptions = {
  en: {
    value: 'en',
    label: 'English'
  },
  it: {
    value: 'it',
    label: 'Italiano'
  }
}

export const LANGUAGE_KEYS = Object.keys(LANGUAGES) as Language[]

const initialState: LanguageState = { ...LANGUAGES.en }
const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    switchLanguage: (state, action: PayloadAction<LanguageState>) => {
      const { value, label } = action.payload

      state.value = value
      state.label = label
    }
  }
})

export const { switchLanguage } = languageSlice.actions
export default languageSlice.reducer
