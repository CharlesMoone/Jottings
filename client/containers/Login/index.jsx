import React from 'react';
import JottingsLogin from '../../components/JottingsLogin';

export default class extends React.PureComponent {
  get routeVariable() {
    const { location: { search = '' } = {}, match: { params = {} } = {} } =
      this.props || {};
    const query = search
      ? Array.from(new URLSearchParams(search.replace(/^\?/, ''))).reduce(
          (obj, [key, value]) => {
            obj[key] = value;
            return obj;
          },
          {}
        )
      : {};
    return { params, query };
  }

  renderLayout(...args) {
    return React.createElement('div', { className: 'becu-component' }, ...args);
  }

  render() {
    return this.renderLayout(
      <div className="becu-items">
        <JottingsLogin data-route={this.routeVariable} />
      </div>
    );
  }
}
