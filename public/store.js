import { PlatinumStore } from './platinum.js'

window.customElements.define('p-store', class extends PlatinumStore {
  constructor() {
    super({
      hnStories: []
    })
  }
  async connectedCallback() {
    Promise.all(
      (
        await fetch(`https://hacker-news.firebaseio.com/v0/topstories.json`)
          .then(res => res.json())
      )
      .slice(0, 3) // 30
      .map(
        async id => await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          .then(res => res.json()))
    ).then(data => {
      this.state.hnStories = data
    })
  }
})