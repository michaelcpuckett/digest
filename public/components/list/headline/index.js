import { PlatinumElement } from '../../../platinum/index.js'

export default class XHeadlineList extends PlatinumElement {
  static get observedAttributes() {
    return [
      'stories',
      'type'
    ]
  }
  constructor() {
    super({
      template: import('./template.html')
    })
  }
  async connectedCallback() {
     this.stories = [{"headline":"Moto G Power and G Stylus: Surprise, Motorola released two new budget phones - CNET","url":"https://www.cnet.com/news/hands-on-moto-g-power-moto-g-stylus-surprise-motorola-released-two-new-budget-phones/"},{"headline":"New York to Sue Trump Administration Over Global Entry Freeze - The New York Times","url":"https://www.nytimes.com/2020/02/07/nyregion/global-entry-lawsuit-ny.html"},{"headline":"Oscars: Pete Hammond’s Absolutely Final Predictions In All 24 Categories - Deadline","url":"https://deadline.com/2020/02/2020-oscar-predictions-1917-parasite-1202850063/"},{"headline":"Go Red day and back to running | Matters of the Heart - WFMZ Allentown","url":"https://www.wfmz.com/features/matters-of-the-heart/go-red-day-and-back-to-running/article_fc2028a6-4948-11ea-b2ae-5ffbaa7efad2.html"},{"headline":"Wolves' Karl-Anthony Towns calls D'Angelo Russell 'big incentive for me to want to stay' - CBS Sports","url":"https://www.cbssports.com/nba/news/wolves-karl-anthony-towns-calls-dangelo-russell-big-incentive-for-me-to-want-to-stay/"},{"headline":"Advocates blame anti-vaxxers after four-year-old boy dies from flu - The Guardian","url":"https://www.theguardian.com/us-news/2020/feb/07/colorado-boy-dies-flu-anti-vaccine-facebook-groups"},{"headline":"Vanessa Bryant announces public memorial for Kobe and Gianna - Los Angeles Times","url":"https://www.latimes.com/sports/lakers/story/2020-02-07/vanessa-bryant-announces-a-celebration-of-life-for-kobe-and-gian"},{"headline":"Chinese data shows 82 per cent of coronavirus cases deemed mild, WHO says - South China Morning Post","url":"https://www.scmp.com/news/china/society/article/3049614/coronavirus-chinese-data-shows-80-cent-cases-are-deemed-mild-who"},{"headline":"UFC 247: Fighters You Should Know - UFC - Ultimate Fighting Championship","url":"https://www.youtube.com/watch?v=UDZCPR8Lo3Y"},{"headline":"Trump ups pressure on star impeachment witness Vindman - POLITICO","url":"https://www.politico.com/news/2020/02/07/donald-trump-pressure-impeachment-witness-alexander-vindman-111997"},{"headline":"Stocks making the biggest moves midday: Uber, eBay, T-Mobile & more - CNBC","url":"https://www.cnbc.com/2020/02/07/stocks-making-the-biggest-moves-midday-uber-ebay-t-mobile-more.html"},{"headline":"Tesla's insane rally already rivals some of the biggest bubbles in recent history - CNN","url":"https://www.cnn.com/2020/02/07/investing/tesla-stock-bubble/index.html"},{"headline":"Buttigieg Leads Sanders in Iowa Delegates, 13-12, With One Outstanding - The New York Times","url":"https://www.nytimes.com/2020/02/07/us/politics/who-won-iowa-caucuses.html"},{"headline":"Samsung Galaxy S20 series already listed on Amazon in the UAE - Android Authority","url":"https://www.androidauthority.com/samsung-galaxy-s20-amazon-1081501/"},{"headline":"New Solar Orbiter mission will give an unprecedented look at our sun - CNN","url":"https://www.cnn.com/2020/02/07/world/solar-orbiter-mission-scn/index.html"},{"headline":"Coronavirus came from bats or possibly pangolins amid ‘acceleration’ of new zoonotic infections - The Washington Post","url":"https://www.washingtonpost.com/health/coronavirus-came-from-bats-or-possibly-pangolins-amid-acceleration-of-new-zoonotic-infections/2020/02/07/11eb7f3a-4379-11ea-b503-2b077c436617_story.html"},{"headline":"2020 NBA Trade Deadline Winners and Losers - The Ringer","url":"https://www.theringer.com/nba/2020/2/7/21127128/nba-trade-deadline-winners-losers-clippers-rockets"},{"headline":"Appeals court tosses Democrats' emoluments lawsuit against Trump - CNN","url":"https://www.cnn.com/2020/02/07/politics/emoluments-lawsuit-trump/index.html"},{"headline":"Trying to buy the new Motorola Razr on its ‘release date’ was a frustrating failure - The Verge","url":"https://www.theverge.com/2020/2/7/21127955/motorola-razr-foldable-phone-buy-verizon-store-hard-to-find"},{"headline":"Coronavirus outbreak: Passengers stranded on Japan cruise plead for help from Trump, say situation is 'desp... - Fox News","url":"https://www.foxnews.com/media/japan-coronavirus-cruise-ship-passengers-plead-for-help-from-president-trump"}]
//    const url = 'https://hn/stories/topstories'
//    this.stories = (
//      await fetch(url).then(res => res.json())
//    )
//    .slice(0, 10)
//    .map(id => ({ id }))
//    ;(async () => {
//      await window.navigator.serviceWorker.ready
//      window.navigator.serviceWorker.addEventListener('message', event => {
//        if (event.data.type === 'UPDATE_CACHE' && event.data.url === url) {
//          this.stories = event.data.result
//            .slice(0, 30)
//            .map(id => ({ id, key: id }))
//        }
//      })
//      fetch(url)
//    })()
  }
}