import React from 'react';
import { withRouter } from 'react-router-dom';
import BecuLogin from '@becu/login';
import BecuForm from '@becu/form';

export default withRouter(
  class extends BecuLogin {
    get logoTitle() {
      return this.props.logoTitle || `welcome to system`;
    }

    get showRegister() {
      return this.props.showRegister || false;
    }

    get replacePath() {
      return this.props.replacePath || '/';
    }

    get extraFormProps() {
      return {
        ...{
          FetchOptions: { url: '/api/login', method: 'POST', fetchType: 'json' },
          fields: [
            { label: '账号', name: 'username', type: 'string' },
            { label: '密码', name: 'password', type: 'password' },
          ],
          logoTitle: 'welcome to system',
          showRegister: false,
          replacePath: '/sys',
        },
        ...(this.props.extraFormProps || {}),
      };
    }

    loginFormRef = React.createRef();

    loginFormRender() {
      return <BecuForm ref={this.loginFormRef} {...this.extraFormProps} />;
    }
  }
);
