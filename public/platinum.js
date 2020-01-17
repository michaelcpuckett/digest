export class PlatinumStore extends HTMLElement {
  constructor(initialState) {
    super()
    this.state = new Proxy(initialState, {
      set: (_this, key, value) => {
        _this[key] = value
        this.dispatchEvent(new CustomEvent(`$change_${key}`, { detail: value }))
        return true
      }
    })
  }
}





window.customElements.define('platinum-if', class PlatinumForEach extends HTMLElement {
  constructor() {
    super()
  }
  get condition() {
    return this.getAttribute('condition')
  }
  toggle(show) {
    if (!this.element) {
      this.element = (this.template.content.cloneNode(true).firstElementChild)
    }
    if (show) {
      this.appendChild(this.element)
      this.getRootNode().host.$render()
    } else {
      if (this.element) {
        this.fragment.append(this.element)
      }
    }
  }
  connectedCallback() {
    this.template = this.querySelector('template')
    this.fragment = new DocumentFragment()
    if (this.condition) {
      const { host } = this.getRootNode()
      if (host[this.condition]) {
        this.toggle(this.condition)
      }
      host.addEventListener(`$change_${this.condition}`, ({ detail: value }) => {
        this.toggle(value)
      })
    }
  }
})





window.customElements.define('platinum-for-each', class PlatinumForEach extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
  get in() {
    return this.getAttribute('in')
  }
  connectedCallback() {
    const content = this.querySelector('template').content
    window.requestAnimationFrame(() => {
      const $store = this.closest('platinum-store')
      if (this.in) {
        {
          const each = $store.state[this.in]
          if (Array.isArray(each) && each.length) {
            each.map(data => Object.assign(content.cloneNode(true).firstElementChild, data)).forEach(node => this.shadowRoot.append(node))
          }
        }
        $store.addEventListener(`$change_${this.in}`, () => {
          const each = $store.state[this.in]
          if (Array.isArray(each) && each.length) {
            ;[...this.shadowRoot.children].forEach(node => node.remove())
            each.map(data => Object.assign(content.cloneNode(true).firstElementChild, data)).forEach(node => this.shadowRoot.append(node))
          }
        })
      }
    })
  }
})

export class PlatinumElement extends HTMLElement {
  constructor({
    template
  }) {
    super()
    this.attachShadow({ mode: 'open' })
    const templateEl = window.document.createElement('template')
    templateEl.innerHTML = template
    this.shadowRoot.appendChild(templateEl.content.cloneNode(true))

    const $observedProps = this.constructor.$observedProps
    if ($observedProps) {
      $observedProps().forEach(key => {
        if (key in this) {
          this[`$${key}`] = this[key]
          this.$inject(key, this[key])
          this.removeAttribute(key)
        }
        Object.defineProperty(this, key, {
          get() {
            return this[`$${key}`]
          },
          set(value) {
            this[`$${key}`] = value
            this.$inject(key, value)
            this.dispatchEvent(new CustomEvent(`$change_${key}`, { detail: value }))
          }
        })
      })
    }
  }
  get(key) {
    return this[key]
  }
  $inject(key, value) {
    if (!this.querySelector(`[slot="${key}"]`)) {
      const element = window.document.createElement('data')
      element.setAttribute('slot', key)
      this.append(element)
    }
    ;[...this.shadowRoot.querySelectorAll([`[data-attr-${key}]`])].forEach(node => {
      node.setAttribute(node.getAttribute(`data-attr-${key}`), value)
    })
    this.querySelector(`[slot="${key}"]`).innerHTML = value
  }
  $render() {
    const $observedProps = this.constructor.$observedProps
    if ($observedProps) {
      $observedProps().forEach(key => {
        ;[...this.shadowRoot.querySelectorAll([`[data-attr-${key}]`])].forEach(node => {
          node.setAttribute(node.getAttribute(`data-attr-${key}`), this[key])
        })
      })
    }
  }
}