import { Modal, Tooltip } from 'bootstrap'

// Constants
const TOOLTIP_SELECTOR = '[data-bs-toggle="tooltip"]'

/**
 * Initializes Bootstrap UI components.
 */
export function initBootstrapUI() {
  initializeTooltips()
}

/**
 * Initializes tooltip components.
 */
function initializeTooltips() {
  document.querySelectorAll(TOOLTIP_SELECTOR).forEach(el => {
    Tooltip.getOrCreateInstance(el)
  })
}

/**
 * Handles keyboard shortcuts for showing a modal.
 *
 * @param selector - The selector for the modal element.
 * @param key - The key to trigger the modal (default: '/').
 */
export function handleModalKeydown(selector: string, key = '/') {
  document.addEventListener('keydown', e => {
    if (e.key === key) {
      const modalElement = document.querySelector<HTMLElement>(selector)
      if (modalElement) {
        Modal.getOrCreateInstance(modalElement).show(modalElement)
      }
    }
  })
}
