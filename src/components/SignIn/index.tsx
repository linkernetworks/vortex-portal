import * as React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Icon, Button, Divider } from 'antd';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { FormComponentProps } from 'antd/lib/form';

import * as styles from './styles.module.scss';
import { LoginCredential } from '@/models/User';

const FormItem = Form.Item;

type SignInProps = OwnProps & InjectedIntlProps;

interface OwnProps extends FormComponentProps {
  onSubmit: (data: LoginCredential) => any;
}

class SignIn extends React.PureComponent<SignInProps, object> {
  protected handleSubmit = () => {
    const data = this.props.form.getFieldsValue() as LoginCredential;
    this.props.onSubmit(data);
  };

  public render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        <Form>
          <div className={styles.header}>
            <h2>
              <FormattedMessage id="auth.signin" />
            </h2>
            <p>
              <FormattedMessage id="auth.signin.subtitle" />
            </p>
          </div>
          <FormItem>
            {getFieldDecorator('username', {})(
              <Input
                prefix={<Icon className={styles.icon} type="mail" />}
                placeholder={this.props.intl.formatMessage({
                  id: 'auth.username'
                })}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {})(
              <Input
                type="password"
                prefix={<Icon className={styles.icon} type="lock" />}
                placeholder={this.props.intl.formatMessage({
                  id: 'auth.password'
                })}
              />
            )}
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              size="large"
              className={styles['login-button']}
              onClick={this.handleSubmit}
            >
              <FormattedMessage id="auth.signin" />
            </Button>
          </FormItem>
        </Form>
        <Divider className={styles.divider}>
          <FormattedMessage id="auth.hint.doNotHaveAnAccount" />
        </Divider>
        <Button size="large" className={styles['login-button']}>
          <Link to="/signup">
            <FormattedMessage id="auth.signup" />
          </Link>
        </Button>
      </React.Fragment>
    );
  }
}

export default Form.create()(injectIntl(SignIn));
