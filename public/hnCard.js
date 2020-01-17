import { PlatinumElement } from './platinum.js'

window.customElements.define('x-hn-card', class XHNCard extends PlatinumElement {
  static $observedProps() {
    return [
      'id',
      'title',
      'arialabelid',
      'by',
      'url'
    ]
  }
  set $title(value) {
    this.arialabelid = value ? `hn-card-${value.toLowerCase().replace(/ /g, '-')}` : null
  }
  constructor() {
    super({
      template: `
        <article
          data-attr-arialabelid="aria-labelledby"
          typeof="SocialMediaPosting">
          <div property="author">
            <slot name="by"></slot>
          </div>
          <div
            property="sharedContent"
            typeof="Article">
            <a data-attr-url="href">
              <h2
                data-attr-arialabelid="id"
                property="headline">
                <slot name="title"></slot>
              </h2>
            </div>
          </a>
        </article>
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font: inherit;
            color: inherit;
            text-decoration: none;
          }
          :host {
            font-size: 1.4rem;
          }
          article {
            padding: 2px;
            border: 1px solid;
            margin: 2px;
          }
          h2 {
            font-size: 1.8rem;
          }
        </style>
      `
    })
  }
})