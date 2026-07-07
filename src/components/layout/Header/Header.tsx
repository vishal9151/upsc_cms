import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>UPSC CMS Practice</span>
          </Link>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  )
}
