import PlatinumShadow from './Shadow.js'
import PlatinumIf from'./If.js'
import PlatinumForEach from './ForEach.js'
import PlatinumElement from './Element.js'

export {
  PlatinumElement
}

window.customElements.define('p-shadow', PlatinumShadow)
window.customElements.define('p-for-each', PlatinumForEach)
window.customElements.define('p-if', PlatinumIf)
window.customElements.define('p-element', PlatinumElement)