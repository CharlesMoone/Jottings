import React from 'react';
import loadable from '@loadable/component';
import { Switch as OriginSwitch, Route as OriginRoute, Redirect } from 'react-router-dom';
import { Spin } from 'antd';
import Menu from 'antd/es/menu';
import 'antd/es/menu/style';
import AuthConfig from './AuthConf.json';

const AuthContext = React.createContext({
  authList: [],
  reload() {},
});
export default AuthContext;

if (process.env.NODE_ENV === 'development') {
  // 仅在开发环境下添加这个样式
  const style = document.createElement('style');
  const cssText = document.createTextNode(`
  .becu-unauthorization-menu {
    position: relative;
  }
  .becu-unauthorization-menu::before {
    content: '无权限';
    color: #fff;
    background: #ea8d47;
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0px;
    font-size: 12px;
    line-height: 1em;
    padding: 4px 8px 4px 6px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    transform: scale(.8);
    transform-origin: top right;
  }
  `);
  style.appendChild(cssText);
  document.head.appendChild(style);
}

const ErrPage401 = loadable.withLoading(() => import('./401'));
const ErrPage403 = loadable.withLoading(() => import('./403'));
const ErrPage404 = loadable.withLoading(() => import('./404'));

const authMenuRender = (props, context, render) => {
  const { authList } = context;
  const { 'data-becu-auth': auth } = props;
  if (!(auth && authList)) {
    return render();
  }
  if (authList.some(authRoute => authRoute.startsWith(auth))) {
    return render();
  }
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="becu-unauthorization-menu" title="无权限，正式环境下将看不到此菜单项">
        {render()}
      </div>
    );
  }
  return null;
};

const authRouteRender = (props, context, render) => {
  const { authList } = context;
  const { computedMatch: { path } = {} } = props;
  if (!(path && authList)) {
    return render();
  }
  const auth = path.substr(1);
  if (authList.some(authRoute => authRoute.startsWith(auth))) {
    return render();
  }
  if (process.env.NODE_ENV === 'development') {
    return render();
  }
  const ErrorPage = AuthConfig.unauthorized === 401
    ? ErrPage401
    : AuthConfig.unauthorized === 403
    ? ErrPage403
    : ErrPage404;
  return <ErrorPage />;
};

class AuthMenuItem extends Menu.Item {
  render() {
    return (
      <AuthContext.Consumer>
        {context => authMenuRender(this.props, context, super.render.bind(this))}
      </AuthContext.Consumer>
    );
  }
}

class AuthSubMenu extends Menu.SubMenu {
  render() {
    return (
      <AuthContext.Consumer>
        {context => authMenuRender(this.props, context, super.render.bind(this))}
      </AuthContext.Consumer>
    );
  }
}

class AuthMenuItemGroup extends Menu.ItemGroup {}

export class AuthMenu extends Menu {
  static get SubMenu() { return AuthSubMenu }
  static get Item() { return AuthMenuItem }
  static get ItemGroup() { return AuthMenuItemGroup }
  static get Divider() { return Menu.Divider }
}

export * from 'react-router-dom';

export const Route = class AuthRoute extends OriginRoute {
  render() {
    return (
      <AuthContext.Consumer>
        {context => authRouteRender(this.props, context, super.render.bind(this))}
      </AuthContext.Consumer>
    );
  }
}

export class Switch extends React.PureComponent {
  render() {
    return React.createElement(OriginSwitch, this.props, this.props.children, (
      <Route key="becu-not-found-page" component={ErrPage404} />
    ));
  }
}

export class AuthProvider extends React.PureComponent {
  state = {
    loading: !!AuthConfig.enable,
    authList: null,
    redirect: false,
  };

  componentDidMount() {
    if (AuthConfig.enable) {
      this.reload();
    }
  }

  reload = () => new Promise(resolve => {
    this.setState({ loading: true }, async () => {
      const { redirect } = AuthConfig;
      try {
        const response = await fetch(AuthConfig.url);
        if (redirect.enable) {
          if (redirect.rules[response.status]) {
            return this.setState({ redirect: redirect.rules[response.status] });
          }
          if (redirect.rules.always && Number(response.status) >= 300) {
            return this.setState({ redirect: redirect.rules.always });
          }
        }
        const authList = await response.json();
        this.setState({ loading: false, authList }, () => resolve(authList));
      } catch(e) {
        if (redirect.enable && redirect.rules.always) {
          return this.setState({ redirect: redirect.rules.always });
        }
        this.setState({ loading: false, authList: [] }, () => resolve([]));
        console.error('权限列表加载失败！', e);
      }
    });
  });

  render() {
    return (
      <AuthContext.Provider value={{ authList: this.state.authList, reload: this.reload }}>
        {this.state.redirect && <Redirect to={this.state.redirect} />}
        {this.state.loading ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spin size="large" />
          </div>
        ) : this.props.children}
      </AuthContext.Provider>
    );
  }
}
