import PlatinumShadow from './Shadow.js'

export default class PlatinumFor extends PlatinumShadow {
  constructor() {
    super()
  }
  get each() {
    return this.getAttribute('each')
  }
  handleChange({ detail: each }) {
    if (Array.isArray(each) && each.length) {
      ;[...this.shadowRoot.children].forEach(node => node.remove())
      each.map(data => {
        data = { ...data, _host: Object.fromEntries(this.attrs.map(attr => [ attr, this.$store[attr] ])) }
        const shadowEl = window.document.createElement('p-shadow')
        const clone = this.templateContent.cloneNode(true).firstElementChild
        if (clone.tagName.includes('-')) {
          Object.assign(clone, data)
        }
        Object.entries(data).forEach(([ key, value ]) => {
          const dataEl = window.document.createElement('data')
          dataEl.setAttribute('slot', key)
          dataEl.innerText = value
          shadowEl.append(dataEl)

          ;[...(clone.matches(`[data-attr-${key}]`) ? [clone] : []), ...clone.querySelectorAll([`[data-attr-${key}]`])].forEach(node => {
            const attrs = node.getAttribute(`data-attr-${key}`).split(' ')
            if (value !== undefined && value !== null) {
              attrs.forEach(attr => node.setAttribute(attr, value))
            } else {
              attrs.forEach(attr => node.removeAttribute(attr))
            }
          })
          ;[...(clone.matches(`[data-boolean-attr-${key}]`) ? [clone] : []), ...clone.querySelectorAll([`[data-boolean-attr-${key}]`])].forEach(node => {
            const attrs = node.getAttribute(`data-boolean-attr-${key}`).split(' ')
            attrs.forEach(attr => {
              Object.assign(node, { [attr]: value })
            })
          })
        })

        shadowEl.shadowRoot.append(clone)
        return shadowEl
      }).forEach(node => this.shadowRoot.append(node))
    }
  }
  connectedCallback() {
    this.style.display = 'contents'
    this.templateContent = this.querySelector('template').content
    window.requestAnimationFrame(() => {
      this.$store = this.getRootNode().host || this.parentElement
      this.attrs = window.customElements.get(this.$store.tagName.toLowerCase()).observedAttributes || []
      if (this.each) {
        {
          const each = this.$store[this.each]
          if (Array.isArray(each) && each.length) {
            ;[...this.shadowRoot.children].forEach(node => node.remove())
            each.map(data => {
              data = { ...data, _host: Object.fromEntries(this.attrs.map(attr => [ attr, this.$store[attr] ])) }
              const shadowEl = window.document.createElement('p-shadow')
              const clone = this.templateContent.cloneNode(true).firstElementChild
              if (clone.tagName.includes('-')) {
                Object.assign(clone, data)
              }

              Object.entries(data).forEach(([ key, value ]) => {
                const dataEl = window.document.createElement('data')
                dataEl.setAttribute('slot', key)
                dataEl.innerText = value
                shadowEl.append(dataEl)

                ;[...(clone.matches(`[data-attr-${key}]`) ? [clone] : []), ...clone.querySelectorAll([`[data-attr-${key}]`])].forEach(node => {
                  const attrs = node.getAttribute(`data-attr-${key}`).split(' ')
                  if (value !== undefined && value !== null) {
                    attrs.forEach(attr => node.setAttribute(attr, value))
                  } else {
                    attrs.forEach(attr => node.removeAttribute(attr))
                  }
                })
                ;[...(clone.matches(`[data-boolean-attr-${key}]`) ? [clone] : []), ...clone.querySelectorAll([`[data-boolean-attr-${key}]`])].forEach(node => {
                  const attrs = node.getAttribute(`data-boolean-attr-${key}`).split(' ')
                  attrs.forEach(attr => {
                    Object.assign(node, { [attr]: value })
                  })
                })
              })
              shadowEl.shadowRoot.append(clone)
              return shadowEl
            }).forEach(node => this.shadowRoot.append(node))
          }
        }
        // TODO remove event listeners
        this.$store.addEventListener(`$change_${this.each}`, event => this.handleChange(event))
        this.attrs.forEach(attr => {
          this.$store.addEventListener(`$change_${attr}`, ({ detail: value }) => {
            ;[...this.shadowRoot.children].forEach((parent) => {
              const node = parent.shadowRoot.firstElementChild
              if (node.tagName.includes('-')) {
                Object.assign(node, {
                  [attr]: value
                })
              }
            })
          })
        })
      }
    })
  }
}