import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import { Form, Modal, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
};

type PasswordFormProps = OwnProps & FormComponentProps;

interface OwnProps {
  visible: boolean;
  username: string;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

class PasswordForm extends React.PureComponent<PasswordFormProps, object> {
  public state = {
    confirmDirty: false
  };

  protected handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit({
          username: this.props.username,
          password: values.password
        });
      }
    });
  };

  protected handleClose = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  public compareToFirstPassword = (_: any, value: string, callback: any) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  public handleConfirmBlur = (e: any) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  public render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        visible={this.props.visible}
        title={<FormattedMessage id="user.changePassword" />}
        onOk={this.handleSubmit}
        onCancel={this.handleClose}
      >
        <Form>
          <FormItem {...formItemLayout} label="Password">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password!'
                }
              ]
            })(<Input type="password" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Confirm Password">
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your password!'
                },
                {
                  validator: this.compareToFirstPassword
                }
              ]
            })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default compose<PasswordFormProps, OwnProps>(Form.create())(
  PasswordForm
);
