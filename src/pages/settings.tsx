import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../hooks/useTheme'
import { LABELS, THEME_PLACEHOLDER } from '../i18n'
import type { Theme } from '../types'

/**
 * Renders Settings Page, with light/dark mode switch and language selector
 */
export const SettingsPage = () => {
  const [theme, toggleTheme] = useTheme()
  const [lang, _setLang] = useLanguage()

  /**
   * Uses set language to interpolate theme name in the localized label
   * @param theme 'light' | 'dark'
   * @returns string
   */
  const getThemeLabel = (theme: Theme) =>
    LABELS[lang].switchToTheme.replace(THEME_PLACEHOLDER, LABELS[lang][theme])

  return (
    <div>
      <h1>{LABELS[lang].settings}</h1>
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
    </div>
  )
}
