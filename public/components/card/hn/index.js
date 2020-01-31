import { PlatinumElement } from '/platinum.js'
import '../../../lib/long-press.js'

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
      'permalink',
      'kids',
      'topcommentid',
      'commentarialabelid',
      'morecomments',
      'deleted',
      'text'
    ]
  }
  set $kids(value) {
    if (Array.isArray(value) && value.length) {
      this.topcommentid = value[0]
      const [ _, ...comments ] = value.slice(0, 10)
      this.allcomments = comments.map(id => ({ id }))
      this.morecomments = !!this.allcomments.length
      setTimeout(() => {
        value.slice(0, 5).map(id => fetch(`https://hn/story/${id}`))
      }, 0)
    }
  }
  set $id(value) {
    this.permalink = `https://news.ycombinator.com/item?id=${value}`
    this.arialabelid = value ? `hn-card-${value}` : null
    this.commentarialabelid = value ? `hn-comments-${value}` : null
    window.requestAnimationFrame(async () => {
      if (value && (!this.text && !this.url && !this.title)) {
        Object.assign(this, (await fetch(`https://hn/story/${value}`).then(res => res.json())))
      }
    })
  }
  set $topcommentid(value) {
    window.requestAnimationFrame(async () => {
      if (value) {
        const { kids } = await (await fetch(`https://hn/story/${value}`)).json()
        if (kids) {
          kids.forEach(id => fetch(`https://hn/story/${id}`))
        }
      }
    })
  }
  toggleFirst() {
    this.firsttoggled = !this.firsttoggled
  }
  toggleAll() {
    this.alltoggled = !this.alltoggled
  }
  share(event) {
    if (navigator.share) {
      navigator.share({
        url: event.currentTarget.getAttribute('href')
      })
    }
  }
  constructor() {
    super({
      template: import('./template.html')
    })
    this.firsttoggled = false
    this.alltoggled = false
  }
}