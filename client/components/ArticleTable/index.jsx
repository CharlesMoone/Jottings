import React from 'react';
import { Table, Button, message, Popconfirm } from 'antd';
import BecuTable from '@becu/table';
import BecuButtonModal from '@becu/button-modal';
import BecuForm from '@becu/form';
import BecuEditable from '@becu/editable';

import { TableContext } from './context';

import BecuEditButtonModal from './BecuEditButtonModal';

export default class extends BecuTable {
  get FetchOptions() {
    return Object.prototype.hasOwnProperty.call(this.props, 'FetchOptions')
      ? this.props.FetchOptions
      : {
          url: '/',
          // get total from headers['X-Total']
          transform: res => {
            const total = Number(res.headers.get('X-Total')) || 0;
            this.setState({ pager: { ...this.state.pager, total } });
            return res.json();
          },
          ...(this.props.FetchOptions || {
            url: `/api/article`,
            credentials: 'include',
          }),
        };
  }

  get columns() {
    return (
      this.props.columns || [
        { title: 'image', dataIndex: 'image', render: t => <img src={t} style={{ width: 30, height: 30 }} /> },
        { title: 'article title', dataIndex: 'title' },
        { title: 'author', dataIndex: 'author' },
        { title: 'description', dataIndex: 'description', width: 300 },
        {
          title: '操作',
          dataIndex: 'Operation',
          render: (t, r) => [
            <BecuEditButtonModal
              key="edit"
              onClick={() => this.setState({ record: r })}
            />,
            <Popconfirm
              key="delete"
              title="是否删除这条记录"
              okText="是"
              cancelText="否"
              onConfirm={async () => {
                try {
                  let { url, ...headers } = {
                    ...this.FetchOptions,
                    ...this.deleteFetchOptions,
                  };
                  const record = { ...r, ...this.props['data-route'].params };
                  url = url.replace(
                    /\/:([_a-zA-Z][_0-9a-zA-Z]*)/g,
                    (_, name) => `/${record[`${name}`]}`
                  );
                  const { msg = null, code = 1 } = await (await fetch(
                    url,
                    headers
                  )).json();
                  if (code) message.error(msg || 'error');
                  this.refreshData({
                    ...this.state.pager,
                    ...this.state.soter,
                    ...this.state.filter,
                  });
                } catch (err) {
                  message.error('请求异常!');
                }
              }}
            >
              <a href="javascript:;">删除</a>
            </Popconfirm>,
          ],
        },
      ]
    );
  }

  get rowKey() {
    return this.props.rowKey || '_id';
  }

  get pagination() {
    return {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      onChange: this.paginationOnChange,
      current: this.state.pager.page,
      pageSize: this.state.pager.pageSize,
      total: this.state.pager.total,
      ...(this.props.pagination || { showQuickJumper: true }),
    };
  }

  get extraProps() {
    return {
      rowKey: this.rowKey,
      pagination: this.pagination,
      ...(this.props.extraProps || {}),
    };
  }

  get jumpPosition() {
    return Object.prototype.hasOwnProperty.call(this.props, 'jumpPosition')
      ? this.props.jumpPosition
      : start;
  }

  get columnsResize() {
    return this.props.columnsResize || false;
  }

  get filterFields() {
    return this.props.filterFields || [];
  }

  get deleteFetchOptions() {
    return Object.prototype.hasOwnProperty.call(
      this.props,
      'deleteFetchOptions'
    )
      ? this.props.deleteFetchOptions
      : {
          ...this.FetchOptions,
          method: 'DELETE',
          ...({ url: '/api/article/:_id' } || {}),
        };
  }

  get extraComponent() {
    const _comp = [];

    return _comp;
  }

  render() {
    return (
      <TableContext.Provider
        value={{
          record: { ...this.state.record, ...this.props['data-route'] },
          refreshData: this.refreshData.bind(this),
          fetchParams: {
            ...this.state.pager,
            ...this.state.sorter,
            ...this.state.filter,
          },
        }}
      >
        {super.render()}
      </TableContext.Provider>
    );
  }
}
