import { PlatinumElement } from './platinum/index.js'

export default class XApp extends PlatinumElement {
  static get observedAttributes() {
    return [
      'type',
      'showhntop',
      'showtopheadlines',
      'showtweets'
    ]
  }
  set $type(type) {
    this.showhntop = type === 'hntop'
    this.showtweets = type === 'tweets'
    this.showtopheadlines = type === 'topheadlines'
  }
  constructor() {
    super({
      template: `
        <style>
          @import 'base.css';
          h1 {
            padding: 1rem;
            font-size: 2.8rem;
          }
          header {
            padding-top: env(safe-area-inset-top, 0);
          }
        </style>
        <header>
          <h1>Hacker News Top</h1>
        </header>
        <p-if condition="showtopheadlines">
          <template>
            <x-headline-list type="top"></x-headline-list>
          </template>
        </p-if>
        <p-if condition="showhntop">
          <template>
            <x-hn-list type="top"></x-hn-stories>
          </template>
        </p-if>
      `
    })
  }
}