import { PlatinumElement } from '../../../platinum/index.js'

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
      'text',
      'canShare',
      'shareableurl'
    ]
  }
  get canShare() {
    return !!window.navigator.share
  }
  set $kids(k) {
    if (Array.isArray(k) && k.length) {
      const [ topcommentid, ...kids ] = k.slice(0, 10)
      this.topcommentid = topcommentid
      this.allcomments = kids.map(id => ({ id }))
      this.morecomments = !!kids.length
      setTimeout(() => {
        kids.slice(0, 5).map(id => fetch(`https://hn/story/${id}`))
      }, 0)
    }
  }
  set $id(id) {
    this.permalink = `https://news.ycombinator.com/item?id=${id}`
    this.shareableurl = this.permalink
    this.arialabelid = id ? `hn-card-${id}` : null
    this.commentarialabelid = id ? `hn-comments-${id}` : null
    window.requestAnimationFrame(async () => {
      if (id && (!this.text && !this.url && !this.title)) {
        Object.assign(this, (await fetch(`https://hn/story/${id}`).then(res => res.json())))
      }
    })
  }
  set $url(url) {
    this.shareableurl = url
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
  constructor() {
    super({
      template: import('./template.html')
    })
    this.firsttoggled = false
    this.alltoggled = false
  }
}