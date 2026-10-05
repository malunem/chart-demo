import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../hooks/useTheme'
import { LABELS, THEME_PLACEHOLDER } from '../i18n'
import type { Language, Theme } from '../types'

/**
 * Checkbox to switch theme light/dark, with localized label.
 */
export const ThemeToggler = () => {
  const [theme, toggleTheme] = useTheme()
  const [lang] = useLanguage()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center'
      }}>
      <div style={{ marginRight: '5px' }}>{LABELS[lang].color}: </div>
      <input id="theme-toggler" type="checkbox" role="switch" onChange={toggleTheme} />
      <label htmlFor="theme-toggler">
        {theme === 'dark' ? getThemeLabel('light', lang) : getThemeLabel('dark', lang)}
      </label>
    </div>
  )
}

/**
 * Uses set language to interpolate theme name in the localized label
 * @param theme 'light' | 'dark'
 * @returns string
 */
const getThemeLabel = (theme: Theme, lang: Language) =>
  LABELS[lang].switchToTheme.replace(THEME_PLACEHOLDER, LABELS[lang][theme])
