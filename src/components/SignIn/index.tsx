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
  protected handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFields((error: any, value: LoginCredential) => {
      if (!error) {
        this.props.onSubmit(value);
      }
    });
  };

  public render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <div className={styles.header}>
            <h2>
              <FormattedMessage id="auth.signin" />
            </h2>
            <p>
              <FormattedMessage id="auth.signin.subtitle" />
            </p>
          </div>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="form.message.required"
                      values={{
                        field: <FormattedMessage id="auth.username" />
                      }}
                    />
                  )
                },
                {
                  type: 'email',
                  message: <FormattedMessage id="form.message.email" />
                }
              ]
            })(
              <Input
                prefix={<Icon className={styles.icon} type="mail" />}
                placeholder={this.props.intl.formatMessage({
                  id: 'auth.username'
                })}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="form.message.required"
                      values={{
                        field: <FormattedMessage id="auth.password" />
                      }}
                    />
                  )
                }
              ]
            })(
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
              htmlType="submit"
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
