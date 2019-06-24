import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';

export default class Editor extends Component {
  static get propTypes() {
    return {
      content: PropTypes.string,
      decodeContent: PropTypes.bool,
    };
  }

  static get defaultProps() {
    return {
      content: '',
      decodeContent: false,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      content: props.decodeContent
        ? decodeURIComponent(props.content)
        : props.content,
      modules: {
        toolbar: [
          [{ font: [] }, { size: [] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ script: 'super' }, { script: 'sub' }],
          [{ header: '1' }, { header: '2' }, 'blockquote', 'code-block'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
          ],
          ['direction', { align: [] }],
          ['link', 'image', 'video', 'formula'],
          ['clean'],
        ],
      },
    };
  }

  getContent() {
    return this.props.decodeContent
      ? encodeURIComponent(this.state.content)
      : this.state.content;
  }

  onChange(content) {
    this.setState({ content });
  }

  render() {
    return (
      <ReactQuill
        theme="snow"
        modules={this.state.modules}
        value={this.state.content}
        onChange={this.onChange.bind(this)}
      />
    );
  }
}
