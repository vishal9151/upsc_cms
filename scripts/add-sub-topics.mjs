import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '../src/data')

const FILES = [
  '2021-paper1.json',
  '2021-paper2.json',
  '2022-paper1.json',
  '2022-paper2.json',
  '2023-paper1.json',
  '2023-paper2.json',
  '2024-paper1.json',
  '2024-paper2.json',
  '2025-paper1.json',
  '2025-paper2.json',
]

for (const file of FILES) {
  const path = join(dataDir, file)
  const questions = JSON.parse(readFileSync(path, 'utf8'))
  const updated = questions.map((q) => ({
    ...q,
    sub_topics: q.sub_topics ?? [],
  }))
  writeFileSync(path, `${JSON.stringify(updated, null, 2)}\n`)
  console.log(`${file}: added sub_topics to ${updated.length} questions`)
}
