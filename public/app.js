import { PlatinumElement } from './platinum.js'

export default class XApp extends PlatinumElement {
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
            <x-hn-list type="top"></x-hn-stories>
          </template>
        </p-if>
      `
    })
  }
}