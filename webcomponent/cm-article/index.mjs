import cmArticle from './template/cm-article.mtmp';
import './js/item.mjs';

class CmArticle extends HTMLElement {
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

  get method() {
    return this.getAttribute('method');
  }

  set method(method) {
    if (method) {
      this.setAttribute('method', method);
    } else {
      this.removeAttribute('method');
    }
  }

  get fetchdata() {
    return this.hasAttribute('fetchdata');
  }

  set fetchdata(fetchdata) {
    if (fetchdata) {
      this.setAttribute('fetchdata', fetchdata);
    } else {
      this.removeAttribute('fetchdata');
    }
  }

  constructor() {
    super();

    this.fetchdata && this.getArticleList();
  }

  async getArticleList() {
    const response = await fetch(this.url, {
      method: this.method || 'GET',
    });

    const { data } = await response.json();

    const articleList = [];
    Array.prototype.forEach.call(data, item => {
      const articleItem = document.createElement('cm-article-item');
      articleItem.setAttribute('title', item.title);
      articleItem.setAttribute('author', item.author);
      articleItem.setAttribute('_id', item._id);
      articleList.push(articleItem);
    });

    articleList.forEach(al => {
      cmArticle.content.querySelector('article').appendChild(al);
    });

    let shadowRoot = this.attachShadow({ mode: 'open' });
    
    const instance = cmArticle.content.cloneNode(true);
    
    shadowRoot.appendChild(instance);
  }
}

customElements.define('cm-article', CmArticle);