import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const syncTargets = [
  {
    label: 'public assets',
    sourceDir: path.resolve(__dirname, '../../public'),
    targetDir: path.resolve(__dirname, '../public'),
  },
  {
    label: 'shared app data',
    sourceDir: path.resolve(__dirname, '../../src/data'),
    targetDir: path.resolve(__dirname, '../src/data'),
  },
  {
    label: 'Netlify functions',
    sourceDir: path.resolve(__dirname, '../../netlify/functions'),
    targetDir: path.resolve(__dirname, '../netlify/functions'),
  },
]

async function exists(dirPath) {
  try {
    await fs.access(dirPath)
    return true
  } catch {
    return false
  }
}

async function syncDirectory({ label, sourceDir, targetDir }) {
  if (!(await exists(sourceDir))) {
    throw new Error(`Source ${label} directory not found: ${sourceDir}`)
  }

  await fs.rm(targetDir, { recursive: true, force: true })
  await fs.mkdir(path.dirname(targetDir), { recursive: true })
  await fs.cp(sourceDir, targetDir, { recursive: true })
  process.stdout.write(`Synced ${label} from ${sourceDir} to ${targetDir}\n`)
}

async function main() {
  for (const target of syncTargets) {
    await syncDirectory(target)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
