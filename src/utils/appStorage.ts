import { EXAM_STORAGE_PREFIX } from '@/types/persistence'
import {
  PRACTICE_CONFIG_PREFIX,
  PRACTICE_INDEX_KEY,
} from '@/types/practice'
import { HISTORY_PREFIX, RESULT_PREFIX } from '@/utils/resultStorage'

export const APP_BUILD_KEY = 'app-build-id'

const RESERVED_KEYS = new Set(['theme', APP_BUILD_KEY])

const APP_DATA_PREFIXES = [
  EXAM_STORAGE_PREFIX,
  RESULT_PREFIX,
  HISTORY_PREFIX,
  PRACTICE_CONFIG_PREFIX,
] as const

function isAppDataKey(key: string): boolean {
  if (RESERVED_KEYS.has(key)) return false
  return APP_DATA_PREFIXES.some((prefix) => key.startsWith(prefix))
}

export function clearAllAppData(): void {
  try {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (isAppDataKey(key) || key === PRACTICE_INDEX_KEY)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  } catch {
    // Fail silently
  }
}

/** Clears saved exams, results, and practice data when a new build is deployed. */
export function syncBuildVersion(): boolean {
  const currentBuildId = __APP_BUILD_ID__
  const storedBuildId = localStorage.getItem(APP_BUILD_KEY)

  if (storedBuildId === currentBuildId) {
    return false
  }

  clearAllAppData()
  localStorage.setItem(APP_BUILD_KEY, currentBuildId)
  return true
}
