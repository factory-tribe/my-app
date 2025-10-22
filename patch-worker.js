// Script to patch the generated worker with the polyfill
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const polyfillCode = `
// Polyfill for process.report
if (typeof process !== 'undefined') {
  Object.defineProperty(process, 'report', {
    value: {
      getReport: () => ({
        header: {},
        javascriptStack: {},
        nativeStack: [],
        javascriptHeap: {},
        libuv: [],
        workers: [],
        environmentVariables: {},
        sharedObjects: []
      }),
      writeReport: () => '',
      reportOnFatalError: false,
      reportOnSignal: false,
      reportOnUncaughtException: false,
      signal: 'SIGUSR2'
    },
    writable: true,
    configurable: true,
    enumerable: false
  })
}
`

// Patch the init.js file
const initPath = path.join(__dirname, '.open-next/cloudflare/init.js')
if (fs.existsSync(initPath)) {
  let initContent = fs.readFileSync(initPath, 'utf-8')
  
  // Insert polyfill at the beginning, after imports
  const importEndIndex = initContent.indexOf('const cloudflareContextALS')
  if (importEndIndex > 0) {
    initContent = initContent.slice(0, importEndIndex) + polyfillCode + '\n' + initContent.slice(importEndIndex)
    fs.writeFileSync(initPath, initContent)
  } else {
    console.warn('⚠️  Could not find injection point in init.js')
  }
} else {
  console.warn('⚠️  init.js not found, skipping patch')
}


