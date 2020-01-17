import { PlatinumElement } from './platinum.js'

window.customElements.define('x-hn-card', class XHNCard extends PlatinumElement {
  static $observedProps() {
    return [
      'id',
      'title',
      'accessibleid'
    ]
  }
  set $title(value) {
    this.accessibleid = `hn-card-${value.toLowerCase()}`
  }
  constructor() {
    super({
      template: `
        <article data-attr-accessibleid="id">
          <slot name="title"></slot>
        </article>
      `
    })
  }
})