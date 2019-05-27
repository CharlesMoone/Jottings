import cmImage from '../template/cm-image.mtmp';

class CmImage extends HTMLElement {
  get url() {
    return this.getAttribute('url');
  }

  set url(url) {
    if (url) {
      this.setAttribute('url', url);
    } else {
      this.removeAttribute('url');
    }
  }

  constructor() {
    super();

    let shadowRoot = this.attachShadow({ mode: 'open' });
    cmImage.content.querySelector('img').src = this.url;
    const instance = cmImage.content.cloneNode(true);
    shadowRoot.appendChild(instance);
  }
}

customElements.define('cm-image', CmImage);