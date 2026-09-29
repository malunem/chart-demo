import { useAppDispatch, useAppSelector } from '../store/hooks'
import { LANGUAGES, switchLanguage } from '../store/languageSlice'
import type { Language } from '../types'

/**
 * Provides current language and a function to change it
 * @returns [language, setLanguage]
 * @example `setLanguage('en')`
 */
export const useLanguage = () => {
  const { value: language } = useAppSelector((state) => state.language)
  const dispatch = useAppDispatch()

  /**
   * Sets the language by dispatching the `switchLanguage` action.
   * Falls back to `'en'` when the language isn't found in `LANGUAGES`
   */  
  const setLanguage = (lang: Language) => {
    if (LANGUAGES[lang] === undefined) {
      lang = 'en'
    }
    dispatch(switchLanguage({ value: lang, label: LANGUAGES[lang].label }))
  }

  return [language, setLanguage] as const
}
