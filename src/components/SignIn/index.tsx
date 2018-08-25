import * as React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Icon, Button, Divider } from 'antd';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { FormComponentProps } from 'antd/lib/form';

import * as styles from './styles.module.scss';
import { LoginCredential } from '@/models/User';

const FormItem = Form.Item;

interface SignInProps extends FormComponentProps {
  onSubmit: (data: LoginCredential) => any;
}

class SignIn extends React.PureComponent<
  SignInProps & InjectedIntlProps,
  object
> {
  protected handleSubmit = () => {
    const data = this.props.form.getFieldsValue() as LoginCredential;
    this.props.onSubmit(data);
  };

  public render() {
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
            <FormattedMessage id="auth.username">
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
            <FormattedMessage id="auth.password">
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
