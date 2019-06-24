import React from 'react';
import BecuForm from '@becu/form';
import { Button } from 'antd';
import Editor from '../Editor';

import style from './style.css';
import 'react-quill/dist/quill.snow.css';

export default class extends BecuForm {
  get layout() {
    return this.props.layout || 'vertical';
  }

  get fields() {
    return (
      this.props.fields || [
        {
          label: 'article title:',
          name: 'title',
          hasFeedback: true,
          mode: 'default',
        },
        { label: 'author:', name: 'author', hasFeedback: true, mode: 'default' },
        {
          label: 'description of the article:',
          name: 'description',
          hasFeedback: true,
          mode: 'default',
        },
        { label: 'image of the article:', name: 'image', type: 'file' },
      ]
    );
  }

  get FetchOptions() {
    return this.props.FetchOptions || {
      url: '/api/article',
      method: 'POST',
      fetchType: 'multipart',
    };
  }

  get ignoreUnchanged() {
    return this.props.ignoreUnchanged || false;
  }

  editorRef = React.createRef();

  preSubmit(value) {
    super.preSubmit(value);

    value.content = this.editorRef.current.getContent();

    return value;
  }

  writeArticle() {
    this.submit();
  }

  render() {
    return (
      <>
        {super.render()}
        <Editor ref={this.editorRef} decodeContent={true} />
        <Button className={style.submitButton} onClick={this.writeArticle.bind(this)}>Submit</Button>
      </>
    );
  }
}
