#!/usr/bin/env node

import { program } from 'commander'
import { searchDataset, trainDataset } from './api.js'

// boox-cli train
program
  .command('train <source> [destination]')
  .description('Train a Boox dataset')
  .option('-i, --id <field>', 'Field to use as document ID', 'id')
  .option('-f, --features <fields...>', 'Fields to index for search')
  .option('-a, --attributes <fields...>', 'Fields to include as-is')
  .option('-d, --deflate', 'Compress the trained data as a ".dat" file', false)
  .option('-c, --cwd <folder>', 'Working directory', process.cwd())
  .option('-r, --rcname <name>', 'Name of the Boox configuration file', 'boox')
  .action(async (src, dest, { deflate, ...options }) => {
    try {
      await trainDataset(src, dest, { isDeflate: deflate, ...options })
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  })

// boox-cli search
program
  .command('search <source> <query>')
  .description('Search a trained Boox dataset')
  .option('-o, --offset <number>', 'Offset for pagination', '1')
  .option('-l, --length <number>', 'Number of results per page', '10')
  .option(
    '-k, --context <field>',
    'Display the context instead of paginated results object'
  )
  .option(
    '-a, --attrs <fields...>',
    'Fields to display when "--context" is provided'
  )
  .option(
    '-d, --deflate',
    'Assume the trained data is deflated as ".dat" file',
    false
  )
  .option('-c, --cwd <folder>', 'Working directory', process.cwd())
  .option('-r, --rcname <name>', 'Name of the Boox configuration file', 'boox')
  .action(async (src, query, { context, attrs = [], deflate, ...options }) => {
    try {
      const paginateResults = await searchDataset(src, query, {
        isDeflate: deflate,
        ...options
      })

      if (typeof context === 'string') {
        const { currentPage, totalPages, totalResults, results } =
          paginateResults

        console.log(
          `\nPage ${currentPage} of ${totalPages}, Showing ${results.length} of ${totalResults} results\n`
        )
        console.log('='.repeat(30), '\n')

        for (const result of results) {
          const [field, maxlength = 160] = context.split('::')
          const { keywords, text } = result.context(field, +maxlength)

          const meta = attrs
            .map((attr: string) => attr + ': ' + result.attributes[attr])
            .filter(Boolean)

          console.log(...meta, Array.from(keywords), '\n')
          console.log(`${text}...`, '\n')
          console.log('='.repeat(30), '\n')
        }

        console.log(
          `Page ${currentPage} of ${totalPages}, Showing ${results.length} of ${totalResults} results\n`
        )
      } else {
        console.log(paginateResults)
      }
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  })

program.parse()
