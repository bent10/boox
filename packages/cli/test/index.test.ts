/// <reference types="vitest/globals" />

import { readFile, unlink } from 'node:fs/promises'
import { inflate, ungzip } from 'pako'
import { searchDataset, trainDataset } from '../src/api.js'
import pokemonTrained from './fixtures/pokemon-trained.json'

vi.spyOn(process.stderr, 'write').mockImplementation(vi.fn())
vi.spyOn(console, 'time').mockImplementation(vi.fn())
vi.spyOn(console, 'timeEnd').mockImplementation(vi.fn())

beforeEach(() => {
  vi.clearAllMocks()
})

afterAll(async () => {
  await unlink('test/fixtures/pokemon-trained.dat')
  await unlink('test/fixtures/pokemon-trained.gz')
})

describe('train', () => {
  it('should train the dataset and save the trained data', async () => {
    await trainDataset('pokemon.json', '', {
      cwd: 'test/fixtures'
    })

    const trainedDataset = ungzip(
      await readFile('test/fixtures/pokemon-trained.gz'),
      { to: 'string' }
    )
    const state = JSON.parse(trainedDataset)
    expect(state).toEqual(pokemonTrained)
  })

  it('should train the dataset and save the trained data with --defalte flag', async () => {
    await trainDataset('pokemon.json', '', {
      cwd: 'test/fixtures',
      isDeflate: true
    })

    const trainedDataset = inflate(
      await readFile('test/fixtures/pokemon-trained.dat'),
      { to: 'string' }
    )
    const state = JSON.parse(trainedDataset)
    expect(state).toEqual(pokemonTrained)
  })

  it('throws an error for invalid dataset path', async () => {
    await expect(trainDataset('invalid.json', 'missing')).rejects.toThrowError()
  })
})

describe('search', () => {
  it('searches a trained dataset and returns results', async () => {
    const { currentPage, results, totalPages, totalResults } =
      await searchDataset('pokemon-trained.gz', 'pokemon', {
        cwd: 'test/fixtures',
        offset: '2',
        length: '3'
      })

    expect(currentPage).toBe(2)
    expect(results).toHaveLength(2)
    expect(totalPages).toBe(2)
    expect(totalResults).toBe(5)
  })

  it('searches a deflated trained dataset and returns results', async () => {
    const { currentPage, results, totalPages, totalResults } =
      await searchDataset('pokemon-trained.dat', 'grass caterpie', {
        cwd: 'test/fixtures',
        isDeflate: true
      })

    expect(currentPage).toBe(1)
    expect(results).toHaveLength(2)
    expect(totalPages).toBe(1)
    expect(totalResults).toBe(2)
  })

  test('throws an error for invalid trained data path', async () => {
    await expect(searchDataset('invalid.dat', 'missing')).rejects.toThrowError()
  })
})
