import { PlatinumElement } from './platinum.js'

window.customElements.define('p-app', class extends PlatinumElement {
  static get observedAttributes() {
    return [
      'type',
      'showhntop'
    ]
  }
  set $type([value]) {
    this.showhntop = value === 'hntop'
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

window.customElements.define('x-hn-stories', class extends PlatinumElement {
  static get observedAttributes() {
    return [
      'stories',
      'type'
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
    this.stories = JSON.stringify(await Promise.all((
        await fetch(`https://hacker-news.firebaseio.com/v0/topstories.json`)
          .then(res => res.json()))
          .slice(0, 3) // 30
          .map(async id =>
            await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
              .then(res => res.json())
          )
    ))
  }
})