import * as React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Icon, Button, Tabs, Row, Col } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { omit } from 'lodash';

import * as styles from './styles.module.scss';
import { UserFields } from '@/models/User';
import withCapitalize from '@/containers/withCapitalize';
import { toTitleCase } from '@/utils/string';

const CapitalizedMessage = withCapitalize(FormattedMessage);
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

interface SignUpState {
  tabKey: string;
}

interface SignUpProps extends FormComponentProps {
  onSubmit: (fields: UserFields) => void;
}

class SignUp extends React.PureComponent<
  SignUpProps & InjectedIntlProps,
  SignUpState
> {
  private steps = [
    {
      title: 'info',
      content: () => {
        const { getFieldDecorator } = this.props.form;
        return (
          <React.Fragment>
            <FormItem>
              <Row gutter={16} style={{ height: '40px' }}>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator('firstName', {})(
                      <Input
                        placeholder={toTitleCase(
                          this.props.intl.formatMessage({
                            id: 'auth.firstName'
                          })
                        )}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator('lastName', {})(
                      <Input
                        placeholder={toTitleCase(
                          this.props.intl.formatMessage({
                            id: 'auth.lastName'
                          })
                        )}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              {getFieldDecorator('displayName', {})(
                <Input
                  prefix={<Icon className={styles.icon} type="user" />}
                  placeholder={toTitleCase(
                    this.props.intl.formatMessage({
                      id: 'auth.displayName'
                    })
                  )}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('phoneNumber', {})(
                <Input
                  prefix={<Icon className={styles.icon} type="mobile" />}
                  type="tel"
                  placeholder={toTitleCase(
                    this.props.intl.formatMessage({
                      id: 'auth.mobile'
                    })
                  )}
                />
              )}
            </FormItem>
          </React.Fragment>
        );
      }
    },
    {
      title: 'credentials',
      content: () => {
        const { getFieldDecorator } = this.props.form;
        return (
          <React.Fragment>
            <FormItem>
              {getFieldDecorator('username', {})(
                <Input
                  prefix={<Icon className={styles.icon} type="mail" />}
                  placeholder={toTitleCase(
                    this.props.intl.formatMessage({
                      id: 'auth.username'
                    })
                  )}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {})(
                <Input
                  type="password"
                  prefix={<Icon className={styles.icon} type="lock" />}
                  placeholder={toTitleCase(
                    this.props.intl.formatMessage({
                      id: 'auth.password'
                    })
                  )}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('confirmPassword', {})(
                <Input
                  type="password"
                  prefix={<Icon className={styles.icon} type="lock" />}
                  placeholder={this.props.intl.formatMessage({
                    id: 'auth.hint.doubleCheckPassword'
                  })}
                />
              )}
            </FormItem>
          </React.Fragment>
        );
      }
    }
  ];

  constructor(props: SignUpProps & InjectedIntlProps) {
    super(props);
    this.state = {
      tabKey: '0'
    };
  }

  protected handleTabChange = (key: string) => {
    this.setState({ tabKey: key });
  };

  protected handlePreviousClick = () => {
    this.setState(prevState => ({
      tabKey: (+prevState.tabKey - 1).toString()
    }));
  };

  protected handleNextClick = () => {
    this.setState(prevState => ({
      tabKey: (+prevState.tabKey + 1).toString()
    }));
  };

  protected handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = omit(
      this.props.form.getFieldsValue(),
      'confirmPassword'
    ) as UserFields;
    this.props.onSubmit(value);
  };

  public renderTabPane = () => {
    return this.steps.map((step, idx) => {
      return (
        <TabPane
          tab={<CapitalizedMessage id={`auth.step.${step.title}`} />}
          key={idx}
        >
          {step.content()}
        </TabPane>
      );
    });
  };

  public render() {
    const { tabKey } = this.state;
    const isFirst = +tabKey === 0;
    const isLast = +tabKey === this.steps.length - 1;

    return (
      <Form onSubmit={this.handleSubmit}>
        <div className={styles.header}>
          <h2>
            <CapitalizedMessage id="auth.signup" />
          </h2>
          <p>
            <FormattedMessage id="auth.signup.subtitle" />
          </p>
        </div>
        <Tabs activeKey={tabKey} onChange={this.handleTabChange}>
          {this.renderTabPane()}
        </Tabs>
        <FormItem className={styles.actions}>
          <Row gutter={16}>
            {!isFirst && (
              <Col span={12}>
                <Button
                  className={styles.action}
                  onClick={this.handlePreviousClick}
                >
                  <CapitalizedMessage id="action.previous" />
                </Button>
              </Col>
            )}
            <Col span={isFirst ? 24 : 12}>
              {isLast ? (
                <Button
                  type="primary"
                  className={styles.action}
                  htmlType="submit"
                >
                  <CapitalizedMessage id="action.done" />
                </Button>
              ) : (
                <Button
                  type="primary"
                  className={styles.action}
                  onClick={this.handleNextClick}
                >
                  <CapitalizedMessage id="action.next" />
                </Button>
              )}
            </Col>
            <Link to="/signin">
              <FormattedMessage id="auth.alreadyHaveAnAccount" />
            </Link>
          </Row>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(injectIntl(SignUp));
