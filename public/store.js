import { PlatinumStore } from './platinum.js'

window.customElements.define('platinum-store', class extends PlatinumStore {
  constructor() {
    super({
      hnStories: [{
        id: 123,
        key: 123,
        title: 'Test'
      }]
    })
  }
})