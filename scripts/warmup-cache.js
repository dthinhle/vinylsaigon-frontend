/**
 * Cache Warmer Script for baka-frontend
 *
 * Usage: node scripts/warmup-cache.js [domain]
 *
 * This script fetches the sitemap.xml from the specified domain (or vinylsaigon.vn by default)
 * and sends concurrent GET requests to every URL found to prime the Next.js ISR cache.
 */

const https = require('https')
const http = require('http')

const DEFAULT_DOMAIN = 'https://vinylsaigon.vn'
const CONCURRENCY = 5 // Number of simultaneous requests
const SITEMAP_PATH = '/sitemap.xml'

async function fetchUrl(url) {
  const protocol = url.startsWith('https') ? https : http
  return new Promise((resolve, reject) => {
    protocol.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => resolve({ status: res.statusCode, data }))
    }).on('error', (err) => reject(err))
  })
}

function extractUrls(xml) {
  const regex = /<loc>(https?:\/\/[^<]+)<\/loc>/g
  const urls = []
  let match
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1])
  }
  return urls
}

async function warmup() {
  const baseUrl = process.argv[2] || DEFAULT_DOMAIN
  const sitemapUrl = `${baseUrl}${SITEMAP_PATH}`

  console.log(`\n🚀 Starting Cache Warmup for: ${baseUrl}`)
  console.log(`📂 Fetching sitemap: ${sitemapUrl}`)

  try {
    const { status, data } = await fetchUrl(sitemapUrl)

    if (status !== 200) {
      console.error(`❌ Failed to fetch sitemap. Status: ${status}`)
      return
    }

    const urls = extractUrls(data)
    console.log(`✅ Found ${urls.length} URLs in sitemap.`)

    const total = urls.length
    let completed = 0
    let success = 0
    let failed = 0

    // Split URLs into chunks for concurrency
    for (let i = 0; i < urls.length; i += CONCURRENCY) {
      const chunk = urls.slice(i, i + CONCURRENCY)
      console.debug('🚀🚀🚀 ====== i:', i)

      await Promise.all(chunk.map(async (url) => {
        console.debug('🚀🚀🚀 ====== url:', url)
        try {
          const { status } = await fetchUrl(url)
          completed++
          if (status === 200) {
            success++
          } else {
            failed++
          }

          // Log progress every 10%
          if (completed % Math.ceil(total / 10) === 0 || completed === total) {
            const percent = ((completed / total) * 100).toFixed(0)
            console.log(`⏳ Progress: ${percent}% (${completed}/${total}) | Success: ${success} | Failed: ${failed}`)
          }
        } catch (err) {
          completed++
          failed++
          console.error(`❌ Error fetching ${url}: ${err.message}`)
        }
      }))
    }

    console.log('\n✨ Warmup Complete!')
    console.log('📊 Final Stats:')
    console.log(`   - Total: ${total}`)
    console.log(`   - Success: ${success}`)
    console.log(`   - Failed: ${failed}`)

  } catch (err) {
    console.error(`❌ Fatal Error: ${err.message}`)
  }
}

warmup()
