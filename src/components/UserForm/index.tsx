import * as React from 'react';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import {
  Modal,
  Form,
  Select,
  Input,
  Icon,
  Row,
  Col,
  message,
  Alert
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as copy from 'copy-to-clipboard';

import { UserRole, UserFields } from '@/models/User';
import withRequiredRule, {
  InjectedProps as withRequiredRuleProps
} from '@/containers/withRequiredRule';

const FormItem = Form.Item;
const Option = Select.Option;

type UserFormProps = OwnProps &
  FormComponentProps &
  InjectedIntlProps &
  withRequiredRuleProps;

interface OwnProps {
  visiable: boolean;
  isLoading: boolean;
  error: Error | null;
  onClose: () => void;
  onSubmit: (data: UserFields) => void;
  onCloseError: () => void;
}

interface UserFormState {
  generatedPassword: string;
}

const getSimplePassword = () =>
  crypto.getRandomValues(new Uint32Array(1)).toString();

class UserForm extends React.PureComponent<UserFormProps, UserFormState> {
  public readonly state: UserFormState = {
    generatedPassword: getSimplePassword()
  };

  protected handleClickCopy = () => {
    copy(this.props.form.getFieldValue('password'));
    const password = this.props.intl.formatMessage({ id: 'auth.password' });
    message.info(
      this.props.intl.formatMessage(
        {
          id: 'action.copy.success'
        },
        { field: password }
      )
    );
  };

  protected handleOnSubmit = () => {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  };

  public render() {
    const {
      visiable,
      requiredRule,
      onClose,
      isLoading,
      error,
      onCloseError
    } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title={<FormattedMessage id="user.add" />}
        visible={visiable}
        confirmLoading={isLoading}
        onCancel={onClose}
        onOk={this.handleOnSubmit}
        okText={this.props.intl.formatMessage({ id: 'action.create' })}
        destroyOnClose={true}
      >
        {error && (
          <Alert
            type="error"
            showIcon={true}
            closable={true}
            message="Created Failed"
            description={error.message}
            onClose={onCloseError}
          />
        )}
        <Form>
          <FormItem
            label={<FormattedMessage id="auth.username" />}
            required={true}
          >
            {getFieldDecorator('username', {
              rules: [
                requiredRule('auth.username'),
                {
                  type: 'email',
                  message: <FormattedMessage id="form.message.email" />
                }
              ]
            })(<Input type="mail" placeholder="hello@linkernetworks.com" />)}
          </FormItem>
          <FormItem
            label={<FormattedMessage id="auth.password" />}
            help={<FormattedMessage id="auth.help.password" />}
            required={true}
          >
            {getFieldDecorator('password', {
              initialValue: this.state.generatedPassword
            })(
              <Input
                disabled={true}
                addonAfter={
                  <span
                    style={{
                      cursor: 'pointer'
                    }}
                    onClick={this.handleClickCopy}
                  >
                    <Icon type="copy" /> <FormattedMessage id="action.copy" />
                  </span>
                }
              />
            )}
          </FormItem>
          <FormItem label={<FormattedMessage id="auth.role" />} required={true}>
            {getFieldDecorator('role', {
              rules: [requiredRule('auth.username')]
            })(
              <Select>
                {Object.keys(UserRole).map(role => (
                  <Option key={role} value={role}>
                    {role}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem
            label={<FormattedMessage id="auth.displayName" />}
            required={true}
          >
            {getFieldDecorator('displayName', {
              rules: [requiredRule('auth.displayName')]
            })(<Input />)}
          </FormItem>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem
                label={<FormattedMessage id="auth.firstName" />}
                required={true}
              >
                {getFieldDecorator('firstName', {
                  rules: [requiredRule('auth.firstName')]
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label={<FormattedMessage id="auth.lastName" />}
                required={true}
              >
                {getFieldDecorator('lastName', {
                  rules: [requiredRule('auth.lastName')]
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <FormItem
            label={<FormattedMessage id="auth.mobile" />}
            required={true}
          >
            {getFieldDecorator('phoneNumber', {
              rules: [requiredRule('auth.mobile')]
            })(<Input type="tel" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default compose<UserFormProps, OwnProps>(
  Form.create(),
  injectIntl,
  withRequiredRule
)(UserForm);
