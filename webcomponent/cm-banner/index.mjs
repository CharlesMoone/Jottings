import cmBanner from './template/cm-banner.mtmp';
import './js/image.mjs';

class CmBanner extends HTMLElement {
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

  get wrapped() {
    return this.hasAttribute('wrapped');
  }

  set wrapped(wrapped) {
    if (wrapped) {
      this.wrapBanner();
      this.setAttribute('wrapped', wrapped);
    } else {
      window.clearInterval(this.wrapInterval);
      this.removeAttribute('wrapped');
    }
  }

  constructor() {
    super();

    let shadowRoot = this.attachShadow({ mode: 'open' });

    Array.prototype.forEach.call(cmBanner.content.querySelectorAll('cm-image'), (child, index) => {
      child.setAttribute('url', `${this.url}/${index}.png`);
    });
    const instance = cmBanner.content.cloneNode(true);

    shadowRoot.appendChild(instance);

    this.wrapped && this.wrapBanner();
  }

  wrapBanner() {
    const list = Array.prototype.filter.call(
      this.shadowRoot.children,
      child => child.tagName === 'CM-IMAGE',
    );

    this.index = 1;

    this.wrapInterval = setInterval(() => {
      if (this.index > list.length - 1) this.index = 0;
      list[this.index - 1 < 0 ? list.length - 1 : (this.index - 1)].classList.remove('active');
      list[this.index++].classList.add('active');
    }, 5000);
  }
}

customElements.define('cm-banner', CmBanner);
