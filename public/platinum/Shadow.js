export default class PlatinumShadow extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
}