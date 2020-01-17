import { PlatinumElement } from './platinum.js'

window.customElements.define('x-hn-card', class XHNCard extends PlatinumElement {
  static $observedProps() {
    return [
      'id',
      'title',
      'arialabelid',
      'by',
      'url',
      'score',
      'toggled',
      'kids',
      'topcommentid'
    ]
  }
  set $title(value) {
    this.arialabelid = value ? `hn-card-${value.toLowerCase().replace(/ /g, '-')}` : null
  }
  set $kids(value) {
    if (Array.isArray(value) && value.length) {
      this.topcommentid = value[0]
    }
  }
  set $id(value) {
    console.log(value, '...')
    if (value) {
      window.requestAnimationFrame(() => {
        if (!super.title) {
          ;(async () => {
            Object.assign(this, (await fetch(`https://hacker-news.firebaseio.com/v0/item/${value}.json`)
            .then(res => res.json())))
          })()
        }
      })
    }
  }
  handleClick() {
    this.toggled = !this.toggled
  }
  connectedCallback() {
    this.toggled = false
  }
  constructor() {
    super({
      template: `
        <article
          data-attr-arialabelid="aria-labelledby"
          typeof="SocialMediaPosting">
          <div property="author">
            <span class="visually-hidden">By</span>
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
            </a>
          </div>
          <platinum-if condition="score">
            <template>
              <div
                property="interactionStatistic"
                typeof="InteractionCounter">
                <button data-attr-toggled="aria-pressed" onclick="this.getRootNode().host.handleClick(event)">
                  <span property="userInteractionCount">
                    <slot name="score"></slot>
                  </span>
                  <span property="interactionType" value="LikeAction">
                    points
                  </span>
                  <span class="visually-hidden">
                    (Show comments)
                  </span>
                </button>
              </div>
            </template>
          </platinum-if>
          <platinum-if condition="topcommentid">
            <template>
              <platinum-if condition="toggled">
                <template>
                  <x-hn-card data-attr-topcommentid="id"></x-hn-card>
                </template>
              </platinum-if>
            </template>
          </platinum-if>
        </article>
        <style>
          @import 'base.css';
          :host {
            font-size: 1.4rem;
          }
          h2 {
            font-size: 1.8rem;
            display: inline-grid;
          }
          article {
            padding: .8rem;
            border-bottom: .1rem solid;
            margin: .2rem;
            display: grid;
            grid-template-columns: [left] auto [right] minmax(0, 1fr) [end];
            grid-template-rows: [top] auto [bottom] auto [end];
            grid-column-gap: 1.2rem;
            grid-row-gap: .4rem;
          }
          [property="interactionStatistic"] {
            grid-column-start: left;
            grid-row-start: top;
            grid-row-end: end;
            text-align: center;
            display: grid;
            height: 100%;
            grid-template-columns: 100%;
            grid-template-rows: 100%;
            font-size: 1.2rem;
          }
          [property="userInteractionCount"] {
            font-size: 1.8rem;
            display: grid;
          }
          x-hn-card {
            border-top: .1rem solid;
            margin-top: .4rem;
            grid-row-start: end;
            grid-column-start: right;
            grid-column-end: end;
          }
        </style>
      `
    })
  }
})