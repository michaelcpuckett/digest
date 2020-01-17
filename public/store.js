import { PlatinumStore } from './platinum.js'

window.customElements.define('p-store', class extends PlatinumStore {
  constructor() {
    super({
      hnStories: [],
      type: 'hn'
    })
  }
})