import { PlatinumElement } from '/platinum.js'

export default class XHNCard extends PlatinumElement {
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
      'morecomments',
      'deleted',
      'text'
    ]
  }
  set $title(value) {
    this.arialabelid = value ? `hn-card-${value.toLowerCase().replace(/ /g, '-')}` : null
  }
  set $kids(value) {
    if (Array.isArray(value) && value.length) {
      this.topcommentid = value[0]
      const [ _, ...comments ] = value.slice(0, 10)
      this.allcomments = comments.map(id => ({ id }))
      this.morecomments = !!this.allcomments.length
      setTimeout(() => {
        value.slice(0, 5).map(id => fetch(`http://hn/story/${id}`))
      }, 0)
    }
  }
  set $id(value) {
    window.requestAnimationFrame(() => {
      if (value && (!this.text && !this.url && !this.title)) {
        ;(async () => {
          Object.assign(this,
            (
              await fetch(`http://hn/story/${value}`)
              .then(res => res.json())
            )
          )
        })()
      }
    })
  }
  toggleFirst() {
    this.firsttoggled = !this.firsttoggled
  }
  toggleAll() {
    this.alltoggled = !this.alltoggled
  }
  constructor() {
    super({
      template: import('./template.html')
    })
  }
}