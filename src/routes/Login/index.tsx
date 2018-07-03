import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as classNames from 'classnames';
import { Form, Input, Icon, Button, Divider, Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';

import * as styles from './styles.module.scss';
import logo from '@/assets/logo.svg';

import { RootState, RootAction } from '@/store/ducks';
import { intlActions, intlModels } from '@/store/ducks/intl';

const FormItem = Form.Item;

interface LoginPageProps {
  locale: string;
  localeOptions: Array<intlModels.IntlOption>;
  changeLanguage: (locale: string) => any;
}

class Login extends React.PureComponent<LoginPageProps, object> {
  protected handleLangsClick = (locale: string) => {
    this.props.changeLanguage(locale);
  };

  protected langMenu = () => {
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
              <div className={styles.langMenu}>{this.langMenu()}</div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className={styles.form}>
              <Form>
                <div className={styles.header}>
                  <h2>
                    <FormattedMessage id="user.signin" />
                  </h2>
                  <p>
                    <FormattedMessage id="user.signin.hint" />
                  </p>
                </div>
                <FormItem>
                  <FormattedMessage id="user.account">
                    {(message: string) => (
                      <Input
                        prefix={<Icon className={styles.icon} type="user" />}
                        size="large"
                        placeholder={message}
                      />
                    )}
                  </FormattedMessage>
                </FormItem>
                <FormItem>
                  <FormattedMessage id="user.password">
                    {(message: string) => (
                      <Input
                        prefix={<Icon className={styles.icon} type="lock" />}
                        type="password"
                        size="large"
                        placeholder={message}
                      />
                    )}
                  </FormattedMessage>
                </FormItem>
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className={styles['login-button']}
                  >
                    <FormattedMessage id="user.signin" />
                  </Button>
                  <a href="#">
                    <FormattedMessage id="user.forget" />
                  </a>
                </FormItem>
              </Form>
              <Divider className={styles.divider}>
                <FormattedMessage id="user.dont_have_hint" />
              </Divider>
              <Button size="large" className={styles['login-button']}>
                <FormattedMessage id="user.signup" />
              </Button>
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
    localeOptions: state.intl.options
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  changeLanguage: (newLocale: string) =>
    dispatch(intlActions.updateLocale({ locale: newLocale }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
