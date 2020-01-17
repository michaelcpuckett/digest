import { PlatinumElement } from './platinum.js'

window.customElements.define('p-app', class extends PlatinumElement {
  static get observedAttributes() {
    return [
      'hnStories',
      'type',
      'showhn'
    ]
  }
  set $type([value]) {
    this.showhn = value === 'hn'
  }
  constructor() {
    super({
      template: `
        <p-if condition="showhn">
          <template>
            <x-hn-stories></x-hn-stories>
          </template>
        </p-if>
      `
    })
  }
})

window.customElements.define('x-hn-stories', class extends PlatinumElement {
  static get observedAttributes() {
    return [
      'stories'
    ]
  }
  constructor() {
    super({
      template: `
        <p-for-each in="stories">
          <template>
            <x-hn-card></x-hn-card>
          </template>
        </p-for-each>
      `
    })
  }
  async connectedCallback() {
    Promise.all(
      (
        await fetch(`https://hacker-news.firebaseio.com/v0/topstories.json`)
          .then(res => res.json())
      )
      .slice(0, 3) // 30
      .map(
        async id => await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          .then(res => res.json()))
    ).then(data => {
      this.stories = JSON.stringify(data)
    })
  }
})