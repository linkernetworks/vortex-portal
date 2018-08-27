import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import * as classNames from 'classnames';
import { Divider, Row, Col, notification } from 'antd';
import { omit } from 'lodash';
import { Location } from 'history';
import { Dispatch } from 'redux';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

import * as styles from './styles.module.scss';
import logo from '@/assets/logo.png';

import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { intlActions, intlModels } from '@/store/ducks/intl';
import { userOperations, userActions, userModels } from '@/store/ducks/user';
import SignUp from '@/components/SignUp';
import SignIn from '@/components/SignIn';
import * as userAPI from '@/services/user';
import { FlattenUser, LoginCredential } from '@/models/User';

type AuthPageProps = OwnProps & InjectedAuthRouterProps & InjectedIntlProps;

interface OwnProps {
  locale: string;
  localeOptions: Array<intlModels.IntlOption>;
  location: Location;
  auth: userModels.Auth;
  error: Error;
  changeLanguage: (locale: string) => any;
  clearUserError: () => any;
  login: (data: LoginCredential) => any;
  push: (path: string) => any;
}

class AuthPage extends React.PureComponent<AuthPageProps, object> {
  constructor(props: AuthPageProps) {
    super(props);
  }

  public componentDidUpdate(prevProps: AuthPageProps) {
    const { formatMessage } = this.props.intl;

    if (!prevProps.error && this.props.error) {
      notification.error({
        message: formatMessage({
          id: 'auth.hint.signin.failure'
        }),
        description: this.props.error.message,
        duration: 3,
        onClose: () => {
          this.props.clearUserError();
        }
      });
    }
  }

  protected handleLangsClick = (locale: string) => {
    this.props.changeLanguage(locale);
  };

  protected handleSignUpSubmit = (fields: FlattenUser) => {
    const { formatMessage } = this.props.intl;
    const data = {
      loginCredential: {
        username: fields.username,
        password: fields.password
      },
      ...omit(fields, ['username', 'password'])
    };

    userAPI
      .signup(data)
      .then(() => {
        notification.success({
          message: formatMessage({
            id: 'auth.hint.signup.success'
          }),
          description: formatMessage({
            id: 'auth.hint.signup.success.description'
          }),
          duration: 3,
          onClose: () => {
            this.props.push('/signin');
          }
        });
      })
      .catch(e => {
        notification.error({
          message: formatMessage({
            id: 'auth.hint.signup.failure'
          }),
          description: e.response.data.message
        });
      });
  };

  protected handleSignInSubmit = (fields: LoginCredential) => {
    this.props.login(fields);
  };

  protected renderLangMenu = () => {
    const { locale, localeOptions } = this.props;
    const { handleLangsClick } = this;

    return (
      <React.Fragment>
        {localeOptions.map((option, idx) => (
          <React.Fragment key={option.code}>
            <span
              className={classNames({ 'is-actived': locale === option.code })}
              onClick={handleLangsClick.bind(this, option.code)}
            >
              {option.abbr}
            </span>
            {idx !== localeOptions.length - 1 && <Divider type="vertical" />}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  };

  public render() {
    const { location } = this.props;
    return (
      <div className={styles.section}>
        <Row type="flex" align="middle">
          <Col xs={24} md={12}>
            <div className={styles.billboard}>
              <div className={styles.logo}>
                <img src={logo} alt="logo" />
                <h1>Vortex</h1>
              </div>
              <p>Manage your applications and network in the cluster</p>
              <div className={styles.langMenu}>{this.renderLangMenu()}</div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className={styles.form}>
              {location.pathname === '/signin' ? (
                <SignIn onSubmit={this.handleSignInSubmit} />
              ) : (
                <SignUp onSubmit={this.handleSignUpSubmit} />
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    locale: state.intl.locale,
    localeOptions: state.intl.options,
    location: state.router.location as Location,
    auth: state.user.auth,
    error: state.user.error
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction> & RTDispatch) => ({
  changeLanguage: (newLocale: string) =>
    dispatch(intlActions.updateLocale({ locale: newLocale })),
  clearUserError: () => dispatch(userActions.clearUserError()),
  login: (data: LoginCredential) => dispatch(userOperations.login(data)),
  push: (path: string) => dispatch(push(path))
});

export default connect<any>(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(AuthPage));
