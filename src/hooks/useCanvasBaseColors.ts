import { useTheme } from "./useTheme"

/**
 * Base color for labels, legend and lines for the active theme (light/dark)
 * @returns the color string for canvas `strokeStyle` and `fillStyle`: white on dark theme, black on light theme
 */
export const useCanvasBaseColor = () => {
  const [theme] = useTheme()

  return theme === 'light' ? 'black' : 'white'
}