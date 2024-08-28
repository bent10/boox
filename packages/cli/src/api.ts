import { access, constants, mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, join, relative, resolve } from 'path'
import generateBatches from 'batch-me-up'
import Boox, { type BooxOptions, type Dataset, type SearchOptions } from 'boox'
import { oraPromise } from 'ora'
import { deflate, gzip, inflate, ungzip } from 'pako'
import { loadRc } from 'rcfy'
import { getDataSize, getElapsedTime } from './utils.js'

export interface Options extends BooxOptions {
  isDeflate?: boolean
  cwd?: string
  rcname?: string
}

export interface PageOptions {
  offset?: string
  length?: string
}

// --- Constants ---
const DEFAULT_COMPRESSION_LEVEL = 6

/**
 * Trains a Boox dataset and saves the trained data.
 *
 * @param src Path to the dataset file.
 * @param dest Path where the trained data will be saved.
 * @param options Training options.
 */
export async function trainDataset(
  src: string,
  dest: string,
  { rcname = 'boox', cwd, ...options }: Options = {}
) {
  const resolvedCwd = cwd ? resolve(cwd) : process.cwd()
  // Load user config from (e.g. boox.config.js) file, if present
  const userConfig: Options = await loadRc(rcname, resolvedCwd)
  const {
    id = 'id',
    features = ['text'],
    attributes = [],
    modelOptions,
    isDeflate = false
  } = { ...options, ...userConfig }

  const resolvedSrc = relative(process.cwd(), join(resolvedCwd, src))

  const trainedFile = join(
    dest
      ? relative(process.cwd(), join(resolvedCwd, dest))
      : dirname(resolvedSrc),
    `${basename(src).replace(
      extname(src),
      isDeflate ? '-trained.dat' : '-trained.gz'
    )}`
  )

  // Create Boox instance
  const boox = new Boox<Dataset>({ id, features, attributes, modelOptions })

  // Read dataset from file
  const datasets = await oraPromise<Dataset[]>(
    async () => JSON.parse(await readFile(resolvedSrc, 'utf8')),
    {
      text: 'Reading data...',
      successText(data) {
        return `Reading ${getDataSize(data)} data!`
      }
    }
  )

  const batches = await generateBatches(datasets)
  const progress = {
    current: 0,
    length: datasets.length
  }
  const startTime = new Date()

  // Train the model in batches
  await oraPromise(
    ora => {
      return Promise.all(
        batches.map(batch =>
          batch.map(dataset => {
            progress.current++
            ora.text = `Training ${resolvedSrc} ${progress.current} of ${progress.length} - ${getElapsedTime(startTime)}`
            ora.render()
            boox.addDocumentSync(dataset)
          })
        )
      )
    },
    {
      text: 'Start training...',
      successText() {
        return `Trained ${progress.current} documents in ${getElapsedTime(startTime)}`
      }
    }
  )

  // Compress and save the trained state
  const compressor = isDeflate ? deflate : gzip
  const state = JSON.stringify(boox.currentState)
  const compressedState = compressor(state, {
    level: DEFAULT_COMPRESSION_LEVEL
  })

  await oraPromise(
    async () => {
      const distDir = dirname(trainedFile)

      try {
        await access(distDir, constants.F_OK)
      } catch {
        await mkdir(distDir, { recursive: true })
      }

      return await writeFile(trainedFile, compressedState)
    },
    {
      text: 'Saving...',
      successText: `Saved ${getDataSize(state)} state to ${trainedFile}`
    }
  )
}

/**
 * Searches a trained Boox dataset.
 *
 * @param src Path to the trained dataset file.
 * @param query The search query.
 * @param options Search options.
 */
export async function searchDataset(
  src: string,
  query: string,
  {
    rcname = 'boox',
    cwd,
    ...options
  }: Pick<Options, 'cwd' | 'rcname' | 'isDeflate'> & PageOptions = {}
) {
  const resolvedCwd = cwd ? resolve(cwd) : process.cwd()
  // Load user config from (e.g. boox.config.js) file, if present
  const userConfig: Options = await loadRc(rcname, resolvedCwd)
  const {
    modelOptions,
    isDeflate = false,
    offset = 1,
    length = 10
  } = { ...options, ...userConfig }

  const resolvedSrc = relative(process.cwd(), join(resolvedCwd, src))

  // Create Boox instance
  const decompressor = isDeflate ? inflate : ungzip

  // Read trained state from file
  console.time('Loading state')
  const compressedState = await readFile(resolvedSrc)
  const decompressedState = decompressor(compressedState, { to: 'string' })
  const boox = new Boox({ modelOptions })
  const state = JSON.parse(decompressedState)
  // set state
  boox.currentState = state
  console.timeEnd('Loading state')

  console.info('State size:', getDataSize(decompressedState))

  // Perform the search
  // Load user config from (e.g. boox-results.config.js) file, if present
  const resultsConfig: SearchOptions = await loadRc('boox-results', resolvedCwd)
  console.time('Search in')
  const results = await boox.search(query, resultsConfig)
  console.timeEnd('Search in')
  console.log()

  return Boox.paginateSearchResults(results, +offset, +length)
}
