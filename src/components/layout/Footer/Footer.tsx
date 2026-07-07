import { Container } from '@/components/ui/Container'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white py-6 dark:border-gray-800 dark:bg-gray-950">
      <Container>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Made for UPSC CMS Practice
        </p>
      </Container>
    </footer>
  )
}
