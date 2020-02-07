import { PlatinumElement } from '../../../platinum/index.js'

export default class XHeadlineCard extends PlatinumElement {
  static get observedAttributes() {
    return [
      'id',
      'headline',
      'by',
      'url',
      'permalink',
      'canShare',
      'shareableurl'
    ]
  }
  get canShare() {
    return !!window.navigator.share
  }
  set $url(url) {
    this.shareableurl = url
  }
  constructor() {
    super({
      template: import('./template.html')
    })
  }
}