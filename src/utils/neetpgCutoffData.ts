import type {
  CutoffRecord,
  NeetpgCutoffIndex,
  NeetpgDatasetMeta,
} from '@/types/neetpgCutoff'
import neetpgIndex from '@/data/neetpg-cutoff/index.json'

const index = neetpgIndex as NeetpgCutoffIndex

const recordModules = import.meta.glob(
  '@/data/neetpg-cutoff/*.json',
  { eager: true },
)

function filePathToKey(path: string): string {
  const match = path.match(/\/([^/]+\.json)$/)
  return match?.[1] ?? path
}

function moduleToRecords(mod: unknown): CutoffRecord[] | null {
  if (Array.isArray(mod)) return mod as CutoffRecord[]
  if (mod && typeof mod === 'object' && 'default' in mod) {
    const inner = (mod as { default: unknown }).default
    if (Array.isArray(inner)) return inner as CutoffRecord[]
  }
  return null
}

const recordsByFile: Record<string, CutoffRecord[]> = {}

for (const [path, mod] of Object.entries(recordModules)) {
  const fileName = filePathToKey(path)
  if (fileName === 'index.json') continue
  const records = moduleToRecords(mod)
  if (records) recordsByFile[fileName] = records
}

export function getNeetpgToolMeta(): Pick<NeetpgCutoffIndex, 'tool' | 'label'> {
  return { tool: index.tool, label: index.label }
}

export function getNeetpgDatasets(): NeetpgDatasetMeta[] {
  return index.datasets
}

export function getNeetpgDataset(
  datasetId: string,
): { meta: NeetpgDatasetMeta; records: CutoffRecord[] } | null {
  const meta = index.datasets.find((d) => d.id === datasetId)
  if (!meta) return null
  const records = recordsByFile[meta.file]
  if (!records) return null
  return { meta, records }
}
