import React, { Component } from 'react';
import { Button, Spin, message } from 'antd';
import classnames from 'classnames';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import PluginFetch from '@becu/plugin-fetch';

import style from './style.css';
import BlockStyleControls from './components/BlockStyleControls';
import InlineStyleControls from './components/InlineStyleControls';

export default class extends Component {
  get decodeState() {
    return this.props.decodeState || false;
  }

  get editorState() {
    return EditorState.createWithContent(
      stateFromHTML(this.decodeState ? decodeURIComponent(this.props.editorState || '') : this.props.editorState || '')
    );
  }

  get placeholder() {
    return this.props.placeholder || 'Start a jotting...';
  }

  get PluginFetch() {
    return Object.prototype.hasOwnProperty.call(this.props, 'PluginFetch') ? this.props.PluginFetch : PluginFetch;
  }

  get FetchOptions() {
    return Object.prototype.hasOwnProperty.call(this.props, 'FetchOptions')
      ? this.props.FetchOptions
      : {
          url: '/api/article',
          method: 'POST',
          fetchType: 'json',
          ...(this.props.FetchOptions || {}),
        };
  }

  constructor(props) {
    super(props);

    this.state = {
      maxDepth: 4,
      loading: false,
      editorState: this.editorState,
    };
  }

  componentDidMount() {
    if (this.PluginFetch) {
      try {
        this.fetcher = new this.PluginFetch(this.FetchOptions);
      } catch (err) {
        message.error('初始化请求插件失败!');
      }
    }
  }

  onChange = editorState => this.setState({ editorState });

  setEditor = editor => (this.editor = editor);

  focusEditor = () => this.editor && this.editor.focus();

  handleKeyCommand = command => this._handleKeyCommand(command);

  onTab = e => this._onTab(e);

  toggleBlockType = blockType => this._toggleBlockType(blockType);

  toggleInlineStyle = style => this._toggleInlineStyle(style);

  _handleKeyCommand(command) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    return newState ? (this.onChange(newState), true) : false;
  }

  _onTab(e) {
    const { maxDepth, editorState } = this.state;
    this.onChange(RichUtils.onTab(e, editorState, maxDepth));
  }

  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
  }

  _styleMap = {
    CODE: {
      backgroundColor: 'rgba(242, 242, 242, 1)',
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
  };

  _getBlockStyle(block) {
    switch (block.getType()) {
      case 'blockquote':
        return style.richEditor_blockquote;
      default:
        return null;
    }
  }

  saveArticle(content = '') {
    if (this.PluginFetch) {
      this.setState({ loading: true }, async () => {
        try {
          const { msg = null, code = 1 } = (await this.fetcher.main({
            data: { content },
          })) || { msg: null, code: 1 };

          if (code) message.error(msg || '失败');
          else {
            this.saveCallback();
          }
        } catch (err) {
          console.error(err);

          message.error('请求异常!');
        } finally {
          this.setState({ loading: false });
        }
      });
    }
  }

  submitOnClick(contentState) {
    const row = stateToHTML(contentState);

    this.saveArticle(encodeURIComponent(row));
  }

  render() {
    const { editorState, loading } = this.state;

    let className = style.richEditor_editor;
    const contentState = editorState.getCurrentContent();
    if (
      !contentState.hasText() &&
      contentState
        .getBlockMap()
        .first()
        .getType() !== 'unstyled'
    )
      className = classnames(className, style.richEditor_hidePlaceholder);

    return [
      <Spin key='editor' spinning={loading}>
        <div className={style.richEditor_root}>
          <BlockStyleControls editorState={editorState} onToggle={this.toggleBlockType} />
          <InlineStyleControls editorState={editorState} onToggle={this.toggleInlineStyle} />
          <div className={className} onClick={this.focusEditor}>
            <Editor
              ref={this.setEditor}
              blockStyleFn={this._getBlockStyle}
              customStyleMap={this._styleMap}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              placeholder={this.placeholder}
              onChange={this.onChange}
              onTab={this.onTab}
            />
          </div>
        </div>
      </Spin>,
      <Button key='submit' onClick={() => this.submitOnClick(contentState)}>
        提交
      </Button>,
    ];
  }
}
