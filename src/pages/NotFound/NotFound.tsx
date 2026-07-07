import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-8xl font-bold text-blue-600 dark:text-blue-400">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-md text-gray-600 dark:text-gray-400">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="mt-8">
        <Button>
          <Home className="h-4 w-4" />
          Back Home
        </Button>
      </Link>
    </div>
  )
}
