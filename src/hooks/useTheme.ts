import { useAppDispatch, useAppSelector } from '../store/hooks'
import { toggle } from '../store/themeSlice'

/**
 * Provides current theme and a function to toggle it
 * @returns [theme, toggleTheme]
 */
export const useTheme = () => {
  const { value: theme } = useAppSelector((state) => state.theme)
  const dispatch = useAppDispatch()

  /**
   * Toggles the theme by dispatching the `toggle` action
   */
  const toggleTheme = () => {
    dispatch(toggle())
  }

  return [theme, toggleTheme] as const
}
