import { useTheme } from '../hooks/useTheme'
import { Navbar } from './navbar'
import { useEffect } from 'react'

/**
 * Wraps page content within a container and renders top navbar
 */
export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme] = useTheme()

  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('data-bs-theme', theme)
  }, [theme])

  return (
    <div id="layout">
      <Navbar />
      <div className="container-fluid px-4">{children}</div>
    </div>
  )
}
