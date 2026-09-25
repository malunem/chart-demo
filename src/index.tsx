import { createRoot } from 'react-dom/client'
import { Main } from './pages/main'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Chart } from './pages/chart';
import { Settings } from './pages/settings';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: '/chart',
    element: <Chart />
  }, 
  {
    path: '/settings',
    element: <Settings />
  }
]);

let root = document.getElementById("root");
if (!root) {
  root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
}
createRoot(root).render(
  <RouterProvider router={router} />,
);

