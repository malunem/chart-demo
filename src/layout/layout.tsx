import { useTheme } from '../hooks/useTheme'
import { Navbar } from './navbar'
import React, { useEffect } from 'react'

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme] = useTheme()

  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('data-bs-theme', theme)
  }, [theme])

  return (
    <div id="layout">
      <Navbar />
      <div className="container-fluid">{children}</div>
    </div>
  )
}
