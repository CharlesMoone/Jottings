import React, { Component } from 'react';
import { Button } from 'antd';
import classnames from 'classnames';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';

import style from './style.css';
import BlockStyleControls from './components/BlockStyleControls';
import InlineStyleControls from './components/InlineStyleControls';

export default class extends Component {
  get editorState() {
    return this.props.editorState || EditorState.createEmpty();
  }

  get placeholder() {
    return this.props.placeholder || "Start a jotting...";
  }

  constructor(props) {
    super(props);

    this.state = {
      maxDepth: 4,
      editorState: this.editorState,
    };
  }

  componentDidMount() {
    this.focusEditor();

    setTimeout(() => {
      this.setState({
        editorState: EditorState.createWithContent(
          stateFromHTML(decodeURIComponent('%3Cp%3Efdsafdsafsdfd%3C%2Fp%3E')),
        ),
      });
    }, 3000);
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
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
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

  submitOnClick(contentState) {
    const row = stateToHTML(contentState);

    console.log(encodeURIComponent(row));
  }

  render() {
    const { editorState } = this.state;

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
      <div key="editor" className={style.richEditor_root}>
        <BlockStyleControls editorState={editorState} onToggle={this.toggleBlockType} />
        <InlineStyleControls editorState={editorState} onToggle={this.toggleInlineStyle} />
        <div className={className} onClick={this.focusEditor}>
          <Editor
            ref={this.setEditor}
            blockStyleFn={this._getBlockStyle}
            customStyleMap={this._styleMap}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            placeholder={this.placeholder}
            onChange={this.onChange}
            onTab={this.onTab}
          />
        </div>
      </div>,
      <Button key="submit" onClick={() => this.submitOnClick(contentState)}>
        提交
      </Button>,
    ];
  }
}
