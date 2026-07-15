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

/** Roman numeral list marker, e.g. "II." / "IV." (I through X only). */
const INLINE_ROMAN_MARKER =
  /[ \t]+(I|II|III|IV|V|VI|VII|VIII|IX|X)\.[ \t]+(?=[A-Z])/g

/** Arabic numeral list marker, e.g. "2." / "4." (1 through 10 only). */
const INLINE_ARABIC_MARKER = /[ \t]+([1-9]|10)\.[ \t]+(?=[A-Z])/g

/** "Statement-I:" / "Statement II:" style assertion-reason sub-statement marker. */
const INLINE_STATEMENT_MARKER =
  /[ \t]+(Statement[\s-]*(?:I|II)\s*:)/g

/**
 * Trailing instruction line that follows a run of sub-statements, e.g.
 * "Select the correct answer using the code given below.",
 * "Which of the above are correct?",
 * "Which of the statements given above are correct?",
 * "Which of the features given above are generally present in ...?",
 * "How many of the pairs given above are correctly matched?",
 * "Of the above statements, how many are correct?"
 */
const INLINE_TRAILING_INSTRUCTION =
  /[ \t]+(Select the correct answer\b|Which of the above\b|Which of the \w+(?: \w+)? given above\b|How many of the \w+(?: \w+)? given above\b|Of the above \w+,|Which one of the following is correct in respect of the above\b|What is the correct order of the above\b)/gi

/**
 * Breaks sub-statement lists that were OCR'd/typed onto a single line
 * (e.g. "... occur? I. Foo II. Bar III. Baz. Select the correct answer..."
 * or "... occur? 1. Foo 2. Bar 3. Baz. Select the correct answer...")
 * into separate lines, one per numbered statement plus the trailing
 * instruction sentence.
 */
function splitInlineListMarkers(text: string): string {
  return text
    .replace(INLINE_ROMAN_MARKER, '\n$1. ')
    .replace(INLINE_ARABIC_MARKER, '\n$1. ')
    .replace(INLINE_STATEMENT_MARKER, '\n$1')
    .replace(INLINE_TRAILING_INSTRUCTION, '\n$1')
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
  return applyLineRules(splitInlineListMarkers(question), QUESTION_LINE_RULES)
}

/** Same normalization rules as questions — explanations share OCR artifacts. */
export function formatExplanationText(explanation: string): string {
  return formatQuestionText(explanation)
}

/** Same normalization rules for instruction copy shown in the UI. */
export function formatInstructionText(instruction: string): string {
  return formatQuestionText(instruction)
}

/** Whole line is the trailing "pick from the code below" style instruction. */
const INSTRUCTION_LINE =
  /^(Select the correct answer\b.*|Which of the above\b.*|Which of the \w+(?: \w+)? given above\b.*|How many of the \w+(?: \w+)? given above\b.*|Of the above \w+,.*|Which one of the following is correct in respect of the above\b.*|What is the correct order of the above\b.*)$/i

/**
 * Splits a formatted question into its main body and the trailing
 * instruction sentence (e.g. "Select the correct answer using the code
 * given below."), so the instruction can be rendered with extra spacing
 * to visually separate it from the statement list above and the answer
 * options below.
 */
export function splitQuestionInstruction(formattedQuestion: string): {
  main: string
  instruction: string | null
} {
  const lines = formattedQuestion.split('\n')
  const lastLine = lines[lines.length - 1]?.trim() ?? ''

  if (lines.length > 1 && INSTRUCTION_LINE.test(lastLine)) {
    return { main: lines.slice(0, -1).join('\n').trim(), instruction: lastLine }
  }

  return { main: formattedQuestion, instruction: null }
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
