import * as React from 'react';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import { Form, Modal, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import * as NamespaceModel from '@/models/Namespace';
import withRequiredRule, {
  InjectedProps as withRequiredRuleProps
} from '@/containers/withRequiredRule';
import withUniqueRule, {
  InjectedProps as withUniqueRuleProps
} from '@/containers/withUniqueRule';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
};

type NamespaceFormProps = OwnProps &
  InjectedIntlProps &
  FormComponentProps &
  withRequiredRuleProps &
  withUniqueRuleProps;

interface OwnProps {
  namespaces: Array<NamespaceModel.Namespace>;
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

class NamespaceForm extends React.PureComponent<NamespaceFormProps, object> {
  constructor(props: NamespaceFormProps) {
    super(props);
  }

  protected checkNamespaceName = (_: any, value: string, callback: any) => {
    // lower case and '-'
    if (/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(value)) {
      callback();
      return;
    }
    callback(
      this.props.intl.formatMessage({ id: 'namespace.hint.nameFormat' })
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
    const {
      requiredRule,
      uniqueRule,
      intl: { formatMessage },
      namespaces
    } = this.props;
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
                requiredRule('name'),
                uniqueRule(namespaces.map(namespace => namespace.name)),
                {
                  validator: this.checkNamespaceName
                }
              ]
            })(
              <Input
                placeholder={formatMessage(
                  { id: 'form.placeholder.unique' },
                  { field: formatMessage({ id: 'namespace' }) }
                )}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default compose<NamespaceFormProps, OwnProps>(
  Form.create(),
  injectIntl,
  withRequiredRule,
  withUniqueRule
)(NamespaceForm);
