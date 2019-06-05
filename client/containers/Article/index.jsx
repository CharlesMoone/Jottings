import React from 'react';
import { Switch, Route } from '../../Auth';
import loadable from '@loadable/component';
const PageList = loadable.withLoading(() => import('./List'));
const PageAdd = loadable.withLoading(() => import('./Add'));

export default class extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route path="/article/add" component={PageAdd} />
        <Route path="/article/list" component={PageList} />
      </Switch>
    );
  }
}
