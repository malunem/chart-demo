import { Outlet } from 'react-router'
import { useTheme } from '../hooks/useTheme'
import { Navbar } from './navbar'
import { useEffect } from 'react'
import { ErrorBoundary } from '../errorBoundary'

/**
 * Wraps page content within a container and renders top navbar
 */
export const Layout = () => {
  const [theme] = useTheme()

  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('data-bs-theme', theme)
  }, [theme])

  return (
    <div id="layout">
      <Navbar />
      <div className="container-fluid px-4">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  )
}
