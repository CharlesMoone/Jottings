import React from 'react';
import { message } from 'antd';
import BecuButtonModal from '@becu/button-modal';
import BecuEditForm from './BecuEditForm';
import { TableContext } from '../context';

export default class extends BecuButtonModal {
  static contextType = TableContext;

  get name() {
    return this.props.name || '编辑';
  }

  get title() {
    return this.props.title || '编辑';
  }

  get type() {
    return this.props.type || 'text';
  }

  get handleExtraRender() {
    return (
      this.props.handleExtraRender || (
        <BecuEditForm
          ref={this.editFormRef}
          data-becu-data={this.context.record}
        />
      )
    );
  }

  get extraProps() {
    return {
      destroyOnClose: true,
    };
  }

  editFormRef = React.createRef();

  async handleOk() {
    try {
      if (this.editFormRef && this.editFormRef.current) {
        const {
          msg = null,
          code = 1,
        } = (await this.editFormRef.current.submit()) || {
          msg: null,
          code: 1,
        };

        if (code) message.error(msg || 'error');

        this.context.refreshData(this.context.fetchParams);

        this.setState({ visible: false });
      }
    } catch (err) {
      message.error('请求异常!');
    }
  }

  async handleClick() {
    await this.props.onClick();
    super.handleClick();
  }
}
