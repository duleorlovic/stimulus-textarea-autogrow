import { Controller } from 'stimulus'
import { debounce } from './utils'

export default class extends Controller {
  // @ts-ignore
  element: HTMLInputElement
  onResize: EventListenerOrEventListenerObject

  resizeDebounceDelayValue: number

  static values = {
    resizeDebounceDelay: Number
  }

  initialize (): void {
    this.autogrow = this.autogrow.bind(this)
  }

  connect (): void {
    this.element.style.overflow = 'hidden'
    const delay: number = this.resizeDebounceDelayValue || 100

    this.onResize = delay > 0 ? debounce(this.autogrow, delay) : this.autogrow

    this.autogrow()

    this.element.addEventListener('input', this.autogrow)
    window.addEventListener('resize', this.onResize)

    if(this.element.scrollHeight == 0) { // element is initially hidden
      this.element.style.height = `${(this.linesCount() * this.lineHeight()) + this.getPaddingsSum() + 20}px`
    }
  }

  disconnect (): void {
    window.removeEventListener('resize', this.onResize)
  }

  autogrow (): void {
    this.element.style.height = 'auto' // Force re-print before calculating the scrollHeight value.
    this.element.style.height = `${this.element.scrollHeight}px`
  }

  getStyle(el, styleProp) {
    let y = null
    if (el.currentStyle)
      y = el.currentStyle[styleProp]
    else if (window.getComputedStyle)
      y = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp)
    return y
  }

  linesCount() {
    return this.element.value.split("\n").length
  }

  lineHeight() {
    let height_px = this.getStyle(this.element, 'line-height')
    return parseInt(height_px) || 0
  }

  getPaddingsSum() {
    let sum = 0
    let padding_top_px = this.getStyle(this.element, 'padding-top')
    if(padding_top_px) {
      sum += parseInt(padding_top_px) || 0
    }
    let padding_bottom_px = this.getStyle(this.element, 'padding-bottom')
    if(padding_bottom_px) {
      sum += parseInt(padding_bottom_px) || 0
    }
    return sum
  }
}
