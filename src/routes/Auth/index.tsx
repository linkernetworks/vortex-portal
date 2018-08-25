import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import * as classNames from 'classnames';
import { Divider, Row, Col, notification } from 'antd';
import { omit } from 'lodash';
import { Location } from 'history';
import { Dispatch } from 'redux';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';

import * as styles from './styles.module.scss';
import logo from '@/assets/logo.png';

import { RootState, RootAction } from '@/store/ducks';
import { intlActions, intlModels } from '@/store/ducks/intl';
import SignUp from '@/components/SignUp';
import SignIn from '@/components/SignIn';
import * as userAPI from '@/services/user';
import { FlattenUser, LoginCredential } from '@/models/User';

interface AuthPageProps {
  locale: string;
  localeOptions: Array<intlModels.IntlOption>;
  location: Location;
  changeLanguage: (locale: string) => any;
  push: (path: string) => any;
}

// interface LoginPageState {

// }

class AuthPage extends React.PureComponent<
  AuthPageProps & InjectedIntlProps,
  object
> {
  constructor(props: AuthPageProps & InjectedIntlProps) {
    super(props);
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
    const { formatMessage } = this.props.intl;

    userAPI.signin(fields);
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
                <SignIn
                  onSubmit={() => {
                    return;
                  }}
                />
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
    location: state.router.location as Location
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  changeLanguage: (newLocale: string) =>
    dispatch(intlActions.updateLocale({ locale: newLocale })),
  push: (path: string) => dispatch(push(path))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(AuthPage));
