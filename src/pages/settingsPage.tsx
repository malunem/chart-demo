import type { ReactEventHandler } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../hooks/useTheme'
import { LABELS, THEME_PLACEHOLDER } from '../i18n'
import { LANGUAGE_KEYS, LANGUAGES } from '../store/languageSlice'
import type { Language, Theme } from '../types'
import { PageTitle } from '../layout/pageTitle'

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
      <PageTitle title={LABELS[lang].settings} />
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}>
          <div style={{ marginRight: '5px' }}>{LABELS[lang].color}: </div>
          <input id="theme-toggler" type="checkbox" role="switch" onChange={toggleTheme} />
          <label htmlFor="theme-toggler">
            {theme === 'dark' ? getThemeLabel('light') : getThemeLabel('dark')}
          </label>
        </div>
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
                  <option
                    selected={langKey === lang}
                    key={langKey}
                    value={LANGUAGES[langKey].value}>
                    {LANGUAGES[langKey].label}
                  </option>
                )
              })}
            </>
          </select>
        </div>
      </div>
    </div>
  )
}
