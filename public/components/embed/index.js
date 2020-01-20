import { PlatinumElement } from '/platinum.js'

export default class XEmbed extends PlatinumElement {
  static get observedAttributes() {
    return [
      'url'
    ]
  }
  set $url(value) {
    // fetch(value).then(async response => {
      // console.log(value, response)
      // console.log((await response.text()))
    // })
  }
  constructor() {
    super({
      template: import('./template.html')
    })
  }
  // async connectedCallback() {
  // }
}