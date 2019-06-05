import React from 'react';
import { Breadcrumb } from 'antd';

export default class extends React.PureComponent {
  get routeVariable() {
    const { location: { search = '' } = {}, match: { params = {} } = {} } = this.props || {};
    const query = search
      ? Array.from(new URLSearchParams(search.replace(/^\?/, ''))).reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {})
      : {};
    return { params, query };
  }

  renderLayout(...args) {
    return (
      <>
        <Breadcrumb className="becu-bread-crumb">
          <Breadcrumb.Item>文章</Breadcrumb.Item>
          <Breadcrumb.Item>列表</Breadcrumb.Item>
        </Breadcrumb>
        {React.createElement('div', { className: 'becu-component' }, ...args)}
      </>
    );
  }

  render() {
    return this.renderLayout();
  }
}
