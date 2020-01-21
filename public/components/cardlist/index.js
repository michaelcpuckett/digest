import { PlatinumElement } from '/platinum.js'

export default class XCardList extends PlatinumElement {
  static get observedAttributes() {
    return [
      'stories',
      'type',
      'url',
      'showinghn',
      'showingdev'
    ]
  }
  constructor() {
    super({
      template: import('./template.html')
    })
  }
  set $type(type) {
    this.showinghn = type === 'hn'
    this.showingdev = type === 'dev'
  }
  set $showinghn(bool) {
    if (bool) {
      this.url = `http://hn/stories/top`
    }
  }
  set $showingdev(bool) {
    if (bool) {
      this.url = `http://dev/stories/top`
    }
  }
  set $url(url) {
    if (url) {
      ;(async () => {
        this.stories = (await fetch(url).then(res => res.json()))
          .slice(0, 10)
          .map(id => ({ id }))
      })()
    }
  }
  connectedCallback() {
    ;(async () => {
      await window.navigator.serviceWorker.ready
      window.navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'UPDATE_CACHE' && event.data.url === this.url) {
          this.stories = event.data.result
            .slice(0, 30)
            .map(id => ({ id }))
        }
      })
    })()
  }
}