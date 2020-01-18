import { PlatinumElement } from './platinum.js'

window.customElements.define('p-app', class extends PlatinumElement {
  static get observedAttributes() {
    return [
      'type',
      'showhntop'
    ]
  }
  get showhntop() {
    return this.state.type === 'hntop'
  }
  constructor() {
    super({
      template: `
        <p-if condition="showhntop">
          <template>
            <x-hn-stories type="top"></x-hn-stories>
          </template>
        </p-if>
      `
    })
  }
})