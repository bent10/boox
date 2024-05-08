import { Tooltip } from 'bootstrap'
import ClipboardJS from 'clipboard'

const ICON_SUCCESS =
  '<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><g><path d="M22.641,4.232c-.427-.354-1.056-.296-1.409,.128L11.933,15.519l-.433-.433-1.286,1.543,1.078,1.078c.188,.188,.442,.293,.707,.293,.015,0,.03,0,.045,0,.281-.013,.543-.143,.724-.359L22.769,5.64c.354-.424,.296-1.055-.128-1.408Z" fill="var(--bs-success)"></path><path d="M6,18c-.265,0-.52-.105-.707-.293L1.293,13.707c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l3.226,3.226L15.231,4.36c.354-.424,.983-.481,1.409-.128,.424,.354,.481,.984,.128,1.408L6.769,17.64c-.181,.216-.442,.346-.724,.359-.015,0-.03,0-.045,0Z" fill="currentColor"></path></g></svg>'

/**
 * Handles clipboard functionality for copying code snippets.
 */
export function handleClipboard() {
  // Initialize ClipboardJS
  const clipboard = new ClipboardJS('[data-js-copy]', {
    target: trigger =>
      trigger.parentElement?.parentElement?.querySelector('code') || trigger
  })

  clipboard.on('success', e => {
    e.clearSelection()

    const trigger = e.trigger as HTMLElement
    const icon = trigger.querySelector('svg')?.outerHTML || 'Copy'

    showSuccessIcon(trigger)
    setTimeout(() => resetTrigger(trigger, icon), 2000)
  })

  clipboard.on('error', e => {
    showFallbackMessage(e.trigger as HTMLElement)
  })
}

/**
 * Displays the success icon in the trigger element and updates the tooltip.
 *
 * @param trigger - The trigger element that initiated the copy action.
 */
function showSuccessIcon(trigger: HTMLElement) {
  trigger.innerHTML = ICON_SUCCESS
  trigger.classList.add('pe-none')

  const tooltip = Tooltip.getInstance(trigger)
  tooltip?.setContent({ '.tooltip-inner': 'Copied!' })
}

/**
 * Resets the trigger element to its original state and hides the tooltip.
 *
 * @param trigger - The trigger element that initiated the copy action.
 */
function resetTrigger(trigger: HTMLElement, icon: string) {
  trigger.innerHTML = icon
  trigger.classList.remove('pe-none')

  const tooltip = Tooltip.getInstance(trigger)
  tooltip?.setContent({ '.tooltip-inner': 'Copy to clipboard' })
  tooltip?.hide()
}

/**
 * Displays a fallback message in the tooltip for unsupported copy actions.
 *
 * @param trigger - The trigger element that initiated the copy action.
 */
function showFallbackMessage(trigger: HTMLElement) {
  const modifierKey = /mac/i.test(navigator.userAgent) ? '\u2318' : 'Ctrl-'
  const fallbackMsg = `Press ${modifierKey}C to copy`
  const tooltip = Tooltip.getInstance(trigger)

  tooltip?.setContent({ '.tooltip-inner': fallbackMsg })
  trigger.addEventListener(
    'hidden.bs.tooltip',
    () => tooltip?.setContent({ '.tooltip-inner': 'Copy to clipboard' }),
    { once: true }
  )
}
