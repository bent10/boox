import type { State } from 'boox'

/**
 * Fetches data from the specified URL asynchronously and caches it until
 * the user closes the browser.
 *
 * @param url The URL from which to fetch the data.
 * @returns A Promise that resolves to the fetched data.
 * @throws
 *   Error if the network response was not OK or an error occurred during
 *   fetching.
 */
export async function fetchData<T extends object = object>(url: string) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Encoding': 'gzip',
        'Content-Type': 'application/json'
      },
      cache: 'default'
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const blob = await response.blob()
    const ds = new DecompressionStream('gzip')
    const decompressedStream = blob.stream().pipeThrough(ds)

    return (await new Response(decompressedStream).json()) as State<T>
  } catch (error) {
    console.error(error)
    throw error
  }
}

/**
 * Creates a debounced version of a function that delays invoking the original
 * function until after `delay` milliseconds have elapsed since the last time
 * the debounced function was invoked.
 *
 * @param func - The function to debounce.
 * @param delay - The number of milliseconds to delay.
 * @returns A debounced function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<F extends (...args: any[]) => any>(
  func: F,
  delay: number
): (...args: Parameters<F>) => Promise<ReturnType<F>> {
  let timeoutId: ReturnType<typeof setTimeout>

  return function debouncedFunction(
    this: ThisParameterType<F>,
    ...args: Parameters<F>
  ): Promise<ReturnType<F>> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this

    clearTimeout(timeoutId)

    return new Promise<ReturnType<F>>(resolve => {
      timeoutId = setTimeout(async () => {
        const result = await func.apply(context, args)
        resolve(result)
      }, delay)
    })
  }
}
