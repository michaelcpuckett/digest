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
  get not() {
    return this.getAttribute('not')
  }
  toggle(show) {
    // console.log(show)
    show = show && show !== 'false'
    if (!this.element) {
      this.element = (this.template.content.cloneNode(true).firstElementChild)
    }
    if (this.condition) {
      if (show) {
        this.appendChild(this.element)
        this.getRootNode().host.$render() // TODO mutationobserver
      } else {
        this.fragment.append(this.element)
      }
    }
    if (this.not) {
      if (!show) {
        this.appendChild(this.element)
        this.getRootNode().host.$render() // TODO mutationobserver
      } else {
        this.fragment.append(this.element)
      }
    }
  }
  connectedCallback() {
    this.style.display = 'contents'
    this.template = this.querySelector('template')
    this.fragment = new DocumentFragment()
    window.requestAnimationFrame(() => {
      if (this.condition || this.not) {
        const { host } = this.getRootNode()
        if (this.condition) {
          if (host[this.condition]) {
            this.toggle(host[this.condition])
          }
        }
        if (this.not) {
          if (!host[this.condition]) {
            this.toggle(host[this.condition])
          }
        }
        host.addEventListener(`$change_${this.condition || this.not}`, ({ detail: value }) => {
          this.toggle(value)
        })
      }
    })
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
    this.style.display = 'contents'
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

    this.state = new Proxy({}, {
      get: (_, key) => {
        return (_[key] || [])[0]
      },
      set: (_, key, value) => {
        _[key] = value
        this[`$${key}`] = value
        this.$inject(key, value[0])
        this.dispatchEvent(new CustomEvent(`$change_${key}`, { detail: value[0] }))
        return true
      }
    })

    const { observedAttributes } = this.constructor
    if (observedAttributes) {
      observedAttributes.forEach(key => {
        this.state[key] = [this[key]]
        Object.defineProperty(this, key, {
          get() {
            return this.state[key]
          },
          set(value) {
            if (typeof value !== 'undefined' && value !== null) {
              this.setAttribute(key, value)
            } else {
              this.removeAttribute(value)
            }
          }
        })
      })
    }
  }
  attributeChangedCallback(attr, prev, value) {
    this.state[attr] = [value, prev]
  }
  $inject(key, value) {
    ;[...this.querySelectorAll([`[slot="${key}"]`])].forEach(node => {
      node.remove()
    })
    if (value && (typeof value !== 'string' || value.length)) {
      const element = window.document.createElement('data')
      element.setAttribute('slot', key)
      this.append(element)
      this.querySelector(`[slot="${key}"]`).innerHTML = value
    }
    ;[...this.shadowRoot.querySelectorAll([`[data-attr-${key}]`])].forEach(node => {
      node.setAttribute(node.getAttribute(`data-attr-${key}`), value)
    })
  }
  $render() {
    const { observedAttributes } = this.constructor
    if (observedAttributes) {
      observedAttributes.forEach(key => {
        ;[...this.shadowRoot.querySelectorAll([`[data-attr-${key}]`])].forEach(node => {
          node.setAttribute(node.getAttribute(`data-attr-${key}`), this[key])
        })
      })
    }
  }
}