import React from 'react';
import loadable from '@loadable/component';
import { Alert, Button, Icon, Layout, Popover } from 'antd';
import {
  AuthProvider,
  AuthMenu as Menu,
  Switch,
  Route,
  Link,
} from '../../Auth';

import style from './style';

const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;

export default class extends React.PureComponent {
  constructor(props) {
    super(props);

    if (process.env.NODE_ENV === 'development') {
      this.state = {
        menuStatus: sessionStorage.getItem('becu-menu-status') || 'full',
      };
    } else {
      this.state = {
        menuStatus: localStorage.getItem('becu-menu-status') || 'full',
      };
    }
  }

  changeMenuStatus() {
    this.setState(({ menuStatus }) => {
      let status;
      if (menuStatus === 'full') {
        status = 'icon';
      } else if (menuStatus === 'icon') {
        status = 'popover';
      } else {
        status = 'full';
      }
      if (process.env.NODE_ENV === 'development') {
        sessionStorage.setItem('becu-menu-status', status);
      } else {
        localStorage.setItem('becu-menu-status', status);
      }
      return { menuStatus: status };
    });
  }

  renderMenu() {
    const [, ...keys] = this.props.location.pathname.split('/');

    return (
      <Menu
        key="navigator-menu" // for auto generate menu, don't remove this key
        mode="inline"
        defaultOpenKeys={keys}
        selectedKeys={[keys.pop()]}
        style={{ height: '100%', borderRight: 0 }}
      />
    );
  }
  render() {
    const { menuStatus } = this.state;
    const menuWidth =
      menuStatus === 'popover' ? 0 : menuStatus === 'full' ? 200 : 80;

    return (
      <div className="page">
        <AuthProvider>
          <Header className={style.header}>
            <Popover
              content={menuStatus === 'popover' && this.renderMenu()}
              placement="bottomRight"
              arrowPointAtCenter
              overlayClassName="becu-popover-menu"
              {...(menuStatus === 'popover' ? {} : { visible: false })}
            >
              <Button
                icon={
                  menuStatus === 'popover'
                    ? 'bars'
                    : menuStatus === 'full'
                    ? 'menu-fold'
                    : 'menu-unfold'
                }
                size="large"
                ghost
                style={{
                  border: 'none',
                  transform: 'translateX(-28px)',
                  fontSize: '1.5em',
                }}
                onClick={this.changeMenuStatus.bind(this)}
              />
            </Popover>
            <div className={style.logo}>
              <Link to="/sys">
                <img src={`${__webpack_public_path__}images/BECULOGO.png`} />
                <span>BECU</span>
              </Link>
            </div>
          </Header>
          <div className="content">
            <Sider
              width={200}
              style={{ background: '#fff', overflow: 'hidden' }}
              trigger={null}
              collapsible
              collapsed={this.state.menuStatus !== 'full'}
              {...(menuStatus === 'popover' ? { collapsedWidth: 0 } : {})}
            >
              {this.renderMenu()}
            </Sider>
            <Content
              className="becu-content"
              style={{ width: `calc(100% - ${menuWidth}px)` }}
            >
              <Switch>
                <Route
                  render={() => (
                    <Alert
                      message="Hello World!"
                      type="success"
                      showIcon
                      description="欢迎来到 Becu"
                    />
                  )}
                />
              </Switch>
            </Content>
          </div>
        </AuthProvider>
      </div>
    );
  }
}
