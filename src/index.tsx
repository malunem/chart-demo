import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { ChartPage } from './pages/chart'
import { Settings } from './pages/settings'
import { Layout } from './layout/layout'
import { store } from './store/store'
import { Provider as StateProvider } from 'react-redux'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/chart" replace />
  },
  {
    path: '/chart',
    element: <ChartPage />
  },
  {
    path: '/settings',
    element: <Settings />
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
    <Layout>
      <RouterProvider router={router} />,
    </Layout>
  </StateProvider>
)
