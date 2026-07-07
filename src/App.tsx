import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { Exam } from '@/pages/Exam'
import { Home } from '@/pages/Home'
import { Instructions } from '@/pages/Instructions'
import { NotFound } from '@/pages/NotFound'
import { Result } from '@/pages/Result'
import { Review } from '@/pages/Review'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'exam/:year/:paper/instructions', element: <Instructions /> },
      { path: 'exam/:year/:paper', element: <Exam /> },
      { path: 'result/:year/:paper', element: <Result /> },
      { path: 'review/:year/:paper', element: <Review /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
