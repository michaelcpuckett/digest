import { PlatinumElement } from './platinum.js'

export default class XApp extends PlatinumElement {
  static get observedAttributes() {
    return [
      'type',
      'showhntop',
      'showtweets'
    ]
  }
  set $type(type) {
    this.showhntop = type === 'hntop'
    this.showtweets = type === 'tweets'
  }
  set $showtweets(value) {
    if (value) {
      console.log('tweeting')
      ;(async () => {
        console.log((await fetch('https://api.twitter.com/1.1/search/tweets.json')).json())
      })()
    }
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