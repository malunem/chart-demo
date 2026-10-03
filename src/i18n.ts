import type { Language } from './types'

type Labels = {
  chart: string
  settings: string
  export: string
  switchToTheme: string
  dark: string
  light: string
  language: string
  color: string
}

type LabelsI18n = {
  [L in Language]: Labels
}

export const THEME_PLACEHOLDER = '[THEME]'

export const LABELS: LabelsI18n = {
  en: {
    chart: 'Chart',
    settings: 'Settings',
    export: 'Export',
    switchToTheme: `Switch to ${THEME_PLACEHOLDER} theme`,
    dark: 'dark',
    light: 'light',
    language: 'Language',
    color: 'Colour'
  },
  it: {
    chart: 'Grafico',
    settings: 'Impostazioni',
    export: 'Esporta',
    switchToTheme: `Passa al tema ${THEME_PLACEHOLDER}`,
    dark: 'scuro',
    light: 'chiaro',
    language: 'Lingua',
    color: 'Colore'
  }
}
