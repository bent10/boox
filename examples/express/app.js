/**
 * @typedef {import('./types').Pokemon} Pokemon
 */

import fs from 'fs'
import Boox from 'boox'
import express from 'express'
import { ungzip } from 'pako'
import defineBooxConfig from './boox.config.js'

const PORT = process.env.PORT || 3000

/** @type {Boox<Pokemon>} */
const boox = new Boox(defineBooxConfig())

const trainedData = fs.readFileSync('pokemon-100r-trained.gz')
/** @type {import('boox').State<Pokemon>} */
const state = JSON.parse(ungzip(trainedData, { to: 'string' }))

boox.currentState = state

const totalDocuments = Object.keys(boox.currentState.documents).length
const app = express()

// Serve static files
app.use(express.static('public'))

// Search endpoint
app.get('/search', async (req, res) => {
  const { q = '' } = req.query
  const results = await boox.search(q)

  const formattedResults = results.map(result => {
    const { image_url, name: image_alt, hp } = result.attributes
    const { text: name } = result.context('name')
    const { text: set_name } = result.context('set_name')
    const { text: caption } = result.context('caption', 80)

    return { image_url, image_alt, hp, name, set_name, caption }
  })

  res.json({
    totalDocuments,
    totalResults: results.length,
    results: formattedResults
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
