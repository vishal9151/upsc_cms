import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { Exam } from '@/pages/Exam'
import { ExamPapers } from '@/pages/ExamPapers'
import { Home } from '@/pages/Home'
import { Instructions } from '@/pages/Instructions'
import { NotFound } from '@/pages/NotFound'
import { PracticeBuilder, PracticeInstructions, SubjectTopicPracticeBuilder, HighYieldPracticeBuilder } from '@/pages/Practice'
import { Result } from '@/pages/Result'
import { Review } from '@/pages/Review'
import {
  NeetpgCutoffDatasetList,
  NeetpgCutoffEntry,
  NeetpgCutoffResults,
} from '@/pages/NeetpgCutoff'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'neetpg-cutoff', element: <NeetpgCutoffDatasetList /> },
      { path: 'neetpg-cutoff/:datasetId', element: <NeetpgCutoffEntry /> },
      {
        path: 'neetpg-cutoff/:datasetId/results',
        element: <NeetpgCutoffResults />,
      },
      {
        path: 'exams/:examKey',
        children: [
          { index: true, element: <ExamPapers /> },
          { path: 'practice', element: <PracticeBuilder /> },
          { path: 'practice/topics', element: <SubjectTopicPracticeBuilder /> },
          { path: 'exam/:year/:paper/instructions', element: <Instructions /> },
          { path: 'exam/:year/:paper', element: <Exam /> },
          { path: 'result/:year/:paper', element: <Result /> },
          { path: 'review/:year/:paper', element: <Review /> },
        ],
      },
      // Legacy CMS routes — examKey defaults to "cms" in components
      { path: 'exam/:year/:paper/instructions', element: <Instructions /> },
      { path: 'exam/:year/:paper', element: <Exam /> },
      { path: 'result/:year/:paper', element: <Result /> },
      { path: 'review/:year/:paper', element: <Review /> },
      { path: 'practice', element: <PracticeBuilder /> },
      { path: 'practice/topics', element: <SubjectTopicPracticeBuilder /> },
      { path: 'practice/high-yield', element: <HighYieldPracticeBuilder /> },
      { path: 'practice/:testId/instructions', element: <PracticeInstructions /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
