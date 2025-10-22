// Polyfills for Cloudflare Workers environment

// Polyfill for process.report which is not available in Workers
// This needs to be defined before any code tries to access it
if (typeof process !== 'undefined') {
  // Force override process.report even if it exists
  Object.defineProperty(process, 'report', {
    value: {
      getReport: () => {
        // Return a minimal report object
        return {
          header: {},
          javascriptStack: {},
          nativeStack: [],
          javascriptHeap: {},
          libuv: [],
          workers: [],
          environmentVariables: {},
          sharedObjects: []
        }
      },
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

