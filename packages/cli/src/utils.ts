/**
 * Gets the elapsed time since a task started.
 *
 * @param startTime The start time.
 * @returns The elapsed time in human-readable format.
 */
export function getElapsedTime(startTime: Date) {
  if (!startTime) {
    return '0s'
  }

  const elapsedTime = new Date().getTime() - startTime.getTime()
  return formatTime(elapsedTime)
}

/**
 * Converts time (in milliseconds) into a human-readable format.
 *
 * @param time The time in milliseconds.
 * @returns The formatted time string.
 */
function formatTime(time: number) {
  const totalSeconds = Math.floor(time / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const formattedTime = [
    hours > 0 ? `${hours.toString().padStart(2, '0')}h` : '',
    minutes > 0 ? `${minutes.toString().padStart(2, '0')}m` : '',
    `${seconds.toString().padStart(2, '0')}s`
  ]
    .filter(Boolean)
    .join(' ')

  return formattedTime
}

/**
 * Calculates the size of a data in bytes and returns it in a human-readable format.
 *
 * @param data The data to calculate the size of.
 * @returns The data size in a human-readable format (e.g., "1.23 MB").
 */
export function getDataSize(data: string | object) {
  const dataStr = typeof data === 'string' ? data : JSON.stringify(data)
  const sizeInBytes = dataStr.length
  return formatBytes(sizeInBytes)
}

/**
 * Converts a number of bytes into a human-readable format.
 *
 * @param bytes The number of bytes to format.
 * @param decimals The number of decimal places to include (optional).
 * @returns The formatted size string (e.g., "1.23 MB").
 */
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
