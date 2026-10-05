import type { ReactEventHandler } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { LABELS } from '../i18n'
import { LANGUAGE_KEYS, LANGUAGES } from '../store/languageSlice'
import type { Language } from '../types'

/**
 * Renders select dropdown to change language
 */
export const LanguageSelector = () => {
  const [lang, setLang] = useLanguage()

  /**
   * Dispatches the selected language in the global state
   * @param evt - event from the form select at option change
   */
  const handleSelect: ReactEventHandler<HTMLSelectElement> = (evt) => {
    setLang(evt.currentTarget.value as Language)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center'
      }}>
      <div style={{ marginRight: '5px' }}>{LABELS[lang].language}: </div>

      <select aria-label="Language select" onChange={handleSelect}>
        <>
          {LANGUAGE_KEYS.map((langKey) => {
            return (
              <option selected={langKey === lang} key={langKey} value={LANGUAGES[langKey].value}>
                {LANGUAGES[langKey].label}
              </option>
            )
          })}
        </>
      </select>
    </div>
  )
}
