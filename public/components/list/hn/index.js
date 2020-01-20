import { PlatinumElement } from '/platinum.js'

export default class XHNList extends PlatinumElement {
  static get observedAttributes() {
    return [
      'stories',
      'type'
    ]
  }
  constructor() {
    super({
      template: import('./template.html')
    })
  }
  async connectedCallback() {
    const url = 'http://hn/stories/topstories'
    this.stories = (
      await fetch(url).then(res => res.json())
    )
    .slice(0, 10)
    .map(id => ({ id }))
    await window.navigator.serviceWorker.ready
    window.navigator.serviceWorker.addEventListener('message', event => {
      if (event.data.type === 'UPDATE_CACHE' && event.data.url === url) {
        this.stories = event.data.result
          .slice(0, 30)
          .map(id => ({ id }))
      }
    })
    fetch(url)
  }
}