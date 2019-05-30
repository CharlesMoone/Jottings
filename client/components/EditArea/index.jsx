import React, { Component } from 'react';
import { Button } from 'antd';
import classnames from 'classnames';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';

import style from './style.css';
import BlockStyleControls from './components/BlockStyleControls';
import InlineStyleControls from './components/InlineStyleControls';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      maxDepth: 4,
      editorState: EditorState.createEmpty(),
    };
  }

  componentDidMount() {
    this.focusEditor();
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
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, inlineStyle));
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
            placeholder="Tell a story..."
            onChange={this.onChange}
            onTab={this.onTab}
            spellCheck={true}
          />
        </div>
      </div>,
      <Button key="submit" onClick={() => console.log(editorState.getCurrentContent())}>
        提交
      </Button>,
    ];
  }
}
