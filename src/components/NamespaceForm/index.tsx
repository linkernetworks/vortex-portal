import * as React from 'react';
import * as NamespaceModel from '@/models/Namespace';
import { FormattedMessage } from 'react-intl';
import { Form, Modal, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
};

interface NamespaceFormProps extends FormComponentProps {
  namespaces: Array<NamespaceModel.Namespace>;
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

class NamespaceForm extends React.PureComponent<NamespaceFormProps, any> {
  constructor(props: NamespaceFormProps) {
    super(props);
  }

  protected checkNamespaceName = (rule: any, value: string, callback: any) => {
    this.props.namespaces.map(namespace => {
      if (namespace.name === value) {
        callback(`Invalid Name! "${value}" is already exist`);
        return;
      }
    });
    const re = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
    if (re.test(value)) {
      callback();
      return;
    }
    callback(
      `Invalid Name! Must consist of lower case alphanumeric characters, '-' or '.'`
    );
  };

  protected handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  };

  protected handleClose = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  public render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        visible={this.props.visible}
        title={<FormattedMessage id="namespace.add" />}
        onOk={this.handleSubmit}
        onCancel={this.handleClose}
      >
        <Form>
          <FormItem {...formItemLayout} label={<FormattedMessage id="name" />}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  validator: this.checkNamespaceName
                }
              ]
            })(<Input placeholder="Give a unique namespace name" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(NamespaceForm);
