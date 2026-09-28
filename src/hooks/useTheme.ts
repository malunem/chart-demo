import { useAppDispatch, useAppSelector } from '../store/hooks'
import { toggle } from '../store/themeSlice'

export const useTheme = () => {
  const { value: theme } = useAppSelector((state) => state.theme)
  const dispatch = useAppDispatch()

  const toggleTheme = () => {
    dispatch(toggle())
  }

  return [theme, toggleTheme] as const
}
