window.customElements.define('x-disclosure-widget', class XDisclosureWidget extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    this.style.display = 'contents'
    window.requestAnimationFrame(() => {
    })
  }
})