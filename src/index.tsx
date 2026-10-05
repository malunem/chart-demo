import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { ChartPage } from './pages/chartPage'
import { SettingsPage } from './pages/settingsPage'
import { Layout } from './layout/layout'
import { store } from './store/store'
import { Provider as StateProvider } from 'react-redux'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Navigate to="/chart" replace /> },
      { path: '/chart', element: <ChartPage /> },
      { path: '/settings', element: <SettingsPage /> }
    ]
  }
])

let root = document.getElementById('root')
if (!root) {
  root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
}

createRoot(root).render(
  <StateProvider store={store}>
    <RouterProvider router={router} />
  </StateProvider>
)
