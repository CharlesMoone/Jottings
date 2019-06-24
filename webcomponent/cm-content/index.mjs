import cmContent from './template/cm-content.mtmp';

class CmContent extends HTMLElement {
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

    this.url && this.fetchData();
  }

  async fetchData() {
    const response = await fetch(`${this.url}/${new URLSearchParams(location.search.slice(1)).get('_id')}`, {
      method: this.method || 'GET',
    });

    const { data } = await response.json();

    let shadowRoot = this.attachShadow({ mode: 'open' });
    cmContent.content.querySelector('h1.title').innerHTML = data.title;
    cmContent.content.querySelector('span.author').innerHTML = data.author;
    cmContent.content.querySelector('.content').innerHTML = decodeURIComponent(data.content);
    const instance = cmContent.content.cloneNode(true);
    shadowRoot.appendChild(instance);
  }
}

customElements.define('cm-content', CmContent);