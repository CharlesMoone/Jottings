import React from 'react';
import ReactDOM from 'react-dom';
import loadable from '@loadable/component';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Spin } from 'antd';

loadable.withLoading = (loadFn, options) => loadable(loadFn, {
  fallback: (
    <div className="becu-display-center">
      <Spin size="large" />
    </div>
  ),
  ...options,
});

const PageFrame = loadable.withLoading(() => import('./containers/Frame'));

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/sys" component={PageFrame} />
    </Switch>
  </Router>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}