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
    html.setAttribute('class', `${theme}-theme`)
  }, [theme])

  return (
    <div id="layout">
      <Navbar />
      <div
        style={{
          marginLeft: '2vw',
          marginRight: '2vw'
        }}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  )
}
