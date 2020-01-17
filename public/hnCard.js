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
      'deleted',
      'text'
    ]
  }
  set $title([value]) {
    this.arialabelid = value ? `hn-card-${value.toLowerCase().replace(/ /g, '-')}` : null
  }
  set $kids([value]) {
    if (Array.isArray(value) && value.length) {
      this.topcommentid = value[0]
      const [ _, ...comments ] = value.slice(0, 7)
      this.allcomments = comments.map(id => ({ id }))
    }
  }
  set $id([value, prev]) {
    window.requestAnimationFrame(() => {
      if (value && !prev && (!this.text && !this.url && !this.title)) {
        ;(async () => {
          Object.assign(this,
            (
              await fetch(`https://hacker-news.firebaseio.com/v0/item/${value}.json`)
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
  constructor() {
    super({
      template: `
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
            padding: 1rem 0;
            border-top: .2rem solid;
            margin: 1rem 0;
            display: grid;
            grid-template-columns: [left] 100px [right] minmax(0, 1fr) [end];
            grid-template-rows: [top] auto [bottom] auto [end];
            grid-column-gap: 1.2rem;
            grid-row-gap: .4rem;
          }
          button {
            text-decoration: underline;
            padding: .4rem 0;
          }
        </style>
        <p-if not="deleted">
          <template>
            <article
              data-attr-arialabelid="aria-labelledby"
              typeof="SocialMediaPosting">
              <div property="author">
                <span class="visually-hidden">By</span>
                <slot name="by"></slot>
              </div>
              <p-if condition="url">
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
              </p-if>
              <p-if condition="score">
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
              </p-if>
              <p-if condition="text">
                <template>
                  <div property="articleBody">
                    <slot name="text"></slot>
                  </div>
                </template>
              </p-if>
              <p-if condition="topcommentid">
                <template>
                  <div>
                    <button data-attr-firsttoggled="aria-pressed" onclick="this.getRootNode().host.toggleFirst(event)">
                      <p-if condition="firsttoggled">
                        <template>
                          <span>
                            Hide
                          </span>
                        </template>
                      </p-if>
                      <p-if not="firsttoggled">
                        <template>
                          <span>
                            Show
                          </span>
                        </template>
                      </p-if>
                      Comments
                    </button>
                    <p-if condition="firsttoggled">
                      <template>
                        <div>
                          <x-hn-card data-attr-topcommentid="id"></x-hn-card>
                          <div>
                            <button data-attr-alltoggled="aria-pressed" onclick="this.getRootNode().host.toggleAll(event)">
                              Toggle All
                            </button>
                            <p-if condition="alltoggled">
                              <template>
                                <p-for-each in="allcomments">
                                  <template>
                                    <x-hn-card></x-hn-card>
                                  </template>
                                </p-for-each>
                              </template>
                            </p-if>
                          </div>
                        </div>
                      </template>
                    </p-if>
                  </div>
                </template>
              </p-if>
            </article>
          </template>
        </p-if>
      `
    })
  }
})