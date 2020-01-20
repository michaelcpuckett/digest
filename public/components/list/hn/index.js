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
    .slice(0, 10) // 30
    .map(id => ({ id }))

    window.navigator.serviceWorker.addEventListener('message', event => {
      if (event.url === url) {
        this.stories = event.data.result
          .slice(0, 10) // 30
          .map(id => ({ id }))
      }
    })
  }
}