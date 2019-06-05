import React from 'react';
import BecuForm from '@becu/form';
import BecuEditor from '@becu/editor';

export default class extends BecuForm {
  get layout() {
    return this.props.layout || 'vertical';
  }

  get fields() {
    return (
      this.props.fields || [
        {
          label: '文章名称:',
          name: 'article',
          hasFeedback: true,
          mode: 'default',
        },
        { label: '作者:', name: 'author', hasFeedback: true, mode: 'default' },
        {
          label: '文章描述:',
          name: 'description',
          hasFeedback: true,
          mode: 'default',
        },
        { label: '图片:', name: 'photo', type: 'file' },
      ]
    );
  }

  editorRef = React.createRef();

  preSubmit(value) {
    super.preSubmit(value);

    return value;
  }

  render() {
    return (
      <>
        {super.render()}
        <BecuEditor ref={this.editorRef} decodeState={true} editorState={''} />
      </>
    );
  }
}
