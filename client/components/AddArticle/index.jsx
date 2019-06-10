import React from 'react';
import BecuForm from '@becu/form';
import BecuEditor from '@becu/editor';
import { Button } from 'antd';

import style from './style.css';

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
        { label: 'image of the article:', name: 'photo', type: 'file' },
      ]
    );
  }

  get FetchOptions() {
    return this.props.FetchOptions || {
      url: '/api/article',
      method: 'POST',
      fetchType: 'json',
    };
  }

  get ignoreUnchanged() {
    return this.props.ignoreUnchanged || false;
  }

  editorRef = React.createRef();

  preSubmit(value) {
    super.preSubmit(value);

    value.content = this.editorRef.current.getContentState();

    return value;
  }

  writeArticle() {
    this.submit();
  }

  render() {
    return (
      <>
        {super.render()}
        <BecuEditor ref={this.editorRef} decodeState={true} editorState={''} />
        <Button className={style.submitButton} onClick={this.writeArticle.bind(this)}>Submit</Button>
      </>
    );
  }
}
