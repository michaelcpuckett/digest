import { PlatinumElement } from './platinum.js'

window.customElements.define('x-hn-card', class XHNCard extends PlatinumElement {
  static get observedAttributes() {
    return [
      'id',
      'title',
      'arialabelid',
      'by',
      'url',
      'score',
      'firsttoggled',
      'alltoggled',
      'kids',
      'topcommentid',
      'text'
    ]
  }
  set $title([]) {
    this.arialabelid = this.title ? `hn-card-${this.title.toLowerCase().replace(/ /g, '-')}` : null
  }
  set $kids([]) {
    if (Array.isArray(this.kids) && this.kids.length) {
      this.topcommentid = this.kids[0]
      const [ first, ...comments ] = this.kids
      this.allcomments = comments.map(id => ({ id }))
    }
  }
  set $id([value, prev]) {
    window.requestAnimationFrame(() => {
      if (value && !prev && (!this.text && !this.url && !this.title)) {
        ;(async () => {
          Object.assign(this,
            (
              await fetch(`https://hacker-news.firebaseio.com/v0/item/${this.id}.json`)
              .then(res => res.json())
            )
          )
        })()
      }
    })
  }
  toggleFirst() {
    this.firsttoggled = !(this.firsttoggled && this.firsttoggled !== 'false')
  }
  toggleAll() {
    this.alltoggled = !(this.alltoggled && this.alltoggled !== 'false')
  }
  connectedCallback() {
    this.firsttoggled = false
    this.alltoggled = false
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
          <platinum-if condition="url">
            <template>
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
            </template>
          </platinum-if>
          <platinum-if condition="score">
            <template>
              <div
                property="interactionStatistic"
                typeof="InteractionCounter">
                <span property="userInteractionCount">
                  <slot name="score"></slot>
                </span>
                <span property="interactionType" value="LikeAction">
                  points
                </span>
                <span class="visually-hidden">
                  (Show comments)
                </span>
              </div>
            </template>
          </platinum-if>
          <platinum-if condition="text">
            <template>
              <div property="articleBody">
                <slot name="text"></slot>
              </div>
            </template>
          </platinum-if>
          <platinum-if condition="topcommentid">
            <template>
              <div property="comment" typeof="Comment">
                <button data-attr-firsttoggled="aria-pressed" onclick="this.getRootNode().host.toggleFirst(event)">
                  <platinum-if condition="firsttoggled">
                    <template>
                      <span>
                        Hide
                      </span>
                    </template>
                  </platinum-if>
                  <platinum-if not="firsttoggled">
                    <template>
                      <span>
                        Show
                      </span>
                    </template>
                  </platinum-if>
                  Comments
                </button>
                <platinum-if condition="firsttoggled">
                  <template>
                    <div>
                      <x-hn-card data-attr-topcommentid="id"></x-hn-card>
                      <div>
                        <button data-attr-alltoggled="aria-pressed" onclick="this.getRootNode().host.toggleAll(event)">
                          Toggle All
                        </button>
                        <platinum-if condition="alltoggled">
                          <template>
                            <platinum-for-each in="allcomments">
                              <template>
                                <x-hn-card></x-hn-card>
                              </template>
                            </platinum-for-each>
                          </template>
                        </platinum-if>
                      </div>
                    </div>
                  </template>
                </platinum-if>
              </div>
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
            border-top: .2rem solid;
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
            font-size: 1.2rem;
          }
          [property="userInteractionCount"] {
            font-size: 1.8rem;
            display: grid;
          }
          [property="articleBody"] {
            grid-row-start: left;
          }
          [property="comment"] {
            grid-row-start: end;
            grid-column-start: right;
            grid-column-end: end;
            display: grid;
            grid-auto-flow: column;
            grid-template-rows: [top] auto [bottom] 1fr;
            grid-template-columns: [left] 1fr [right] min-content;
          }
          button[data-attr-firsttoggled] {
            grid-column-start: right;
            grid-row-start: top;
            grid-row-end: bottom;
          }
          x-hn-card {
            margin-top: .4rem;
            grid-row-start: bottom;
            grid-column-start: left;
          }
        </style>
      `
    })
  }
})