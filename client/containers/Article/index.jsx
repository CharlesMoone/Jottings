import React from 'react';
import { Switch, Route } from '../../Auth';
import loadable from '@loadable/component';
const PageList = loadable.withLoading(() => import('./List'));

export default class extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route path="/article/list" component={PageList} />
      </Switch>
    );
  }
}
