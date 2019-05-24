import cmBanner from '../template/cm-banner.mtmp';

class CmBanner extends HTMLElement {
  constructor() {
    super();

    let shadowRoot = this.attachShadow({ mode: 'open' });
    const instance = cmBanner.content.cloneNode(true);
    shadowRoot.appendChild(instance);
  }
}

customElements.define('cm-banner', CmBanner);