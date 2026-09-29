import type { ReactEventHandler } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../hooks/useTheme'
import { LABELS, THEME_PLACEHOLDER } from '../i18n'
import { LANGUAGE_KEYS, LANGUAGES } from '../store/languageSlice'
import type { Language, Theme } from '../types'

/**
 * Renders Settings Page, with light/dark mode switch and language selector
 */
export const SettingsPage = () => {
  const [theme, toggleTheme] = useTheme()
  const [lang, setLang] = useLanguage()

  /**
   * Uses set language to interpolate theme name in the localized label
   * @param theme 'light' | 'dark'
   * @returns string
   */
  const getThemeLabel = (theme: Theme) =>
    LABELS[lang].switchToTheme.replace(THEME_PLACEHOLDER, LABELS[lang][theme])

  /**
   * Dispatches the selected language in the global state
   * @param evt - event from the form select at option change
   */
  const handleSelect: ReactEventHandler<HTMLSelectElement> = (evt) => {
    setLang(evt.currentTarget.value as Language)
  }

  return (
    <div>
      <h1>{LABELS[lang].settings}</h1>
      <div
        className="container-fluid border py-4 rounded bg-secondary-subtle
">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={theme === 'dark' ? 'switchCheckDefault' : 'switchCheckChecked'}
            onChange={toggleTheme}
          />
          <label className="form-check-label" htmlFor="switchCheckDefault">
            {theme === 'dark' ? getThemeLabel('light') : getThemeLabel('dark')}
          </label>
        </div>
        <select
          className="form-select mt-4 w-auto"
          aria-label="Language select"
          defaultValue="Select Language"
          id="language-select"
          onChange={handleSelect}>
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
    </div>
  )
}
