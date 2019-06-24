import cmArticleItem from '../template/cm-article-item.mtmp';

class CmArticleItem extends HTMLElement {
  get title() {
    return this.getAttribute('title');
  }

  set title(title) {
    if (title) {
      this.setAttribute('title', title);
    } else {
      this.removeAttribute('title');
    }
  }

  get author() {
    return this.getAttribute('author');
  }

  set author(author) {
    if (author) {
      this.setAttribute('author', author);
    } else {
      this.removeAttribute('author');
    }
  }

  get _id() {
    return decodeURIComponent(this.getAttribute('_id'));
  }

  set _id(_id) {
    if (_id) {
      this.setAttribute('_id', _id);
    } else {
      this.removeAttribute('_id');
    }
  }

  constructor() {
    super();

    let shadowRoot = this.attachShadow({ mode: 'open' });
    cmArticleItem.content.querySelector('h1.title').innerHTML = this.title;
    cmArticleItem.content.querySelector('span.author').innerHTML = this.author;
    cmArticleItem.content.querySelector('a').href = `/article/content?_id=${this._id}`;
    const instance = cmArticleItem.content.cloneNode(true);
    shadowRoot.appendChild(instance);
  }
}

customElements.define('cm-article-item', CmArticleItem);