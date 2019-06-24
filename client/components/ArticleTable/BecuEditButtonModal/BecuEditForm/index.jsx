import React from 'react';
import BecuForm from '@becu/form';
import { Button } from 'antd';
import Editor from '../../../Editor';
import { TableContext } from '../../context';

import style from './style.css';
import 'react-quill/dist/quill.snow.css';

export default class extends BecuForm {
  static contextType = TableContext;

  get layout() {
    return this.props.layout || 'vertical';
  }

  get FetchOptions() {
    return Object.prototype.hasOwnProperty.call(this.props, 'FetchOptions')
      ? this.props.FetchOptions
      : {
          ...{ url: `/api/article`, credentials: 'include' },
          url: `/api/article`,
          method: 'PATCH',
          ...{
            url: `/api/article/${this.context.record._id}`,
            fetchType: 'multipart',
          },
        };
  }

  get fields() {
    return (
      this.props.fields || [
        { label: 'image', name: 'image', type: 'file' },
        { label: 'article title', name: 'title', type: 'string' },
        { label: 'author', name: 'author', type: 'string' },
        { label: 'description', name: 'description', type: 'string' },
      ]
    );
  }

  get ignoreUnchanged() {
    return this.props.ignoreUnchanged || false;
  }

  editorRef = React.createRef();

  preSubmit(value) {
    super.preSubmit(value);

    if (Object.prototype.toString.call(value.image) === '[object String]')
      delete value.image;
    value.content = this.editorRef.current.getContent();

    return value;
  }

  writeArticle() {
    this.submit();
  }

  render() {
    const { $$becuData: dataSource = {} } = this.state;

    return (
      <>
        {super.render()}
        <Editor
          ref={this.editorRef}
          content={dataSource.content}
          decodeContent={true}
        />
      </>
    );
  }
}
