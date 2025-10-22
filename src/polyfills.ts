// Polyfills for Cloudflare Workers environment

// Polyfill for process.report.getReport which is not available in Workers
if (typeof process !== 'undefined' && !process.report) {
  (process as any).report = {
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
  }
}

export {}

