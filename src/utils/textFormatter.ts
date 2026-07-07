/**
 * Text formatting utilities for OCR / HTML-extracted exam content.
 * Applied at render time only — never mutates source JSON.
 *
 * Future rules (tables, bullets, sub/superscripts, Greek letters, math)
 * can be added to `lineFormatRules` or `textFormatRules` below.
 */

export type LineFormatRule = (lines: string[]) => string[]
export type TextFormatRule = (text: string) => string

/** Line contains only an Arabic numeral list marker, e.g. "1." */
const ARABIC_MARKER_ONLY = /^(\d+)\s*\.\s*$/

/** Line contains only a Roman numeral list marker, e.g. "IV." */
const ROMAN_MARKER_ONLY = /^([IVXLCDM]+)\s*\.\s*$/i

function isListMarkerOnlyLine(line: string): boolean {
  const trimmed = line.trim()
  return (
    ARABIC_MARKER_ONLY.test(trimmed) || ROMAN_MARKER_ONLY.test(trimmed)
  )
}

function formatListMarker(marker: string): string {
  return /^\d+$/.test(marker) ? marker : marker.toUpperCase()
}

/**
 * Merges standalone list markers with the text on the following line.
 * "1.\nOpening snap" → "1. Opening snap"
 * "I.\nOpening snap" → "I. Opening snap"
 */
export function mergeListMarkers(lines: string[]): string[] {
  const result: string[] = []
  let i = 0

  while (i < lines.length) {
    const trimmed = lines[i].trim()

    if (trimmed === '') {
      result.push('')
      i++
      continue
    }

    const arabicMatch = trimmed.match(ARABIC_MARKER_ONLY)
    const romanMatch = trimmed.match(ROMAN_MARKER_ONLY)
    const markerMatch = arabicMatch ?? romanMatch

    if (markerMatch && i + 1 < lines.length) {
      const nextTrimmed = lines[i + 1].trim()
      if (nextTrimmed !== '' && !isListMarkerOnlyLine(lines[i + 1])) {
        const marker = formatListMarker(markerMatch[1])
        result.push(`${marker}. ${nextTrimmed}`)
        i += 2
        continue
      }
    }

    result.push(trimmed)
    i++
  }

  return result
}

/**
 * Collapses runs of blank lines so at most `maxBlank` empty lines remain.
 */
export function collapseConsecutiveBlankLines(
  lines: string[],
  maxBlank = 1,
): string[] {
  const result: string[] = []
  let blankRun = 0

  for (const line of lines) {
    if (line === '') {
      blankRun++
      if (blankRun <= maxBlank) {
        result.push('')
      }
    } else {
      blankRun = 0
      result.push(line)
    }
  }

  return result
}

function trimLineEdges(lines: string[]): string[] {
  return lines.map((line) => (line === '' ? '' : line.trim()))
}

function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

function splitLines(text: string): string[] {
  return normalizeLineEndings(text).split('\n')
}

/** Ordered pipeline for multi-line question / explanation / instruction text. */
export const lineFormatRules = {
  trimLineEdges,
  mergeListMarkers,
  collapseConsecutiveBlankLines,
} as const

const QUESTION_LINE_RULES: LineFormatRule[] = [
  lineFormatRules.trimLineEdges,
  lineFormatRules.mergeListMarkers,
  (lines) => lineFormatRules.collapseConsecutiveBlankLines(lines, 1),
]

function applyLineRules(text: string, rules: LineFormatRule[]): string {
  let lines = splitLines(text)
  for (const rule of rules) {
    lines = rule(lines)
  }
  return lines.join('\n').trim()
}

/**
 * Cleans malformed question text before display.
 * Normalizes whitespace and standalone numbered / Roman list markers only.
 */
export function formatQuestionText(question: string): string {
  if (!question) return ''
  return applyLineRules(question, QUESTION_LINE_RULES)
}

/** Same normalization rules as questions — explanations share OCR artifacts. */
export function formatExplanationText(explanation: string): string {
  return formatQuestionText(explanation)
}

/** Same normalization rules for instruction copy shown in the UI. */
export function formatInstructionText(instruction: string): string {
  return formatQuestionText(instruction)
}

/**
 * Cleans option text before display.
 * Trims edges and collapses duplicate spaces; preserves wording and punctuation.
 */
export function formatOptionText(option: string): string {
  if (!option) return ''
  return option
    .replace(/\u00a0/g, ' ')
    .trim()
    .replace(/ {2,}/g, ' ')
}

/** Registry for future whole-text transforms (tables, bullets, math, etc.). */
export const textFormatRules = {
  formatQuestionText,
  formatExplanationText,
  formatInstructionText,
  formatOptionText,
} as const
