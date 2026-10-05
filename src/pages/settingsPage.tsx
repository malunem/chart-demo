import { useLanguage } from '../hooks/useLanguage'
import { LABELS } from '../i18n'
import { PageTitle } from '../layout/pageTitle'
import { ThemeToggler } from '../components/themeToggler'
import { LanguageSelector } from '../components/languageSelector'

/**
 * Renders Settings Page, with light/dark mode switch and language selector
 */
export const SettingsPage = () => {
  const [lang] = useLanguage()

  return (
    <div>
      <PageTitle title={LABELS[lang].settings} />
      <div>
        <ThemeToggler />
        <LanguageSelector />
      </div>
    </div>
  )
}
