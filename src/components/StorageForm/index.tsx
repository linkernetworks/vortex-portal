import * as React from 'react';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

import { Modal, Form, Select, Input, Alert } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { StorageFields } from '@/models/Storage';
import { FormField } from '@/utils/types';
import { validateIPv4 } from '@/utils/validate';

const FormItem = Form.Item;
const Option = Select.Option;

interface StorageFormProps
  extends FormComponentProps,
    FormField<StorageFields> {
  visiable: boolean;
  isLoading: boolean;
  error: Error | null;
  onCancel: () => void;
  onChange: (changedFields: any) => void;
  onSubmit: () => void;
  onCloseError: () => void;
}

const fieldRequiredRule = (field: string) => {
  return {
    required: true,
    message: (
      <FormattedMessage
        id="form.message.required"
        values={{
          field: <FormattedMessage id={`storage.${field}`} />
        }}
      />
    )
  };
};

class StorageForm extends React.PureComponent<
  StorageFormProps & InjectedIntlProps,
  object
> {
  protected handleClose = () => {
    this.props.onCancel();
  };

  public render() {
    const { visiable, error, isLoading, onSubmit, onCloseError } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title={<FormattedMessage id="storage.form.createNewStorage" />}
        visible={visiable}
        confirmLoading={isLoading}
        okText={this.props.intl.formatMessage({ id: 'action.create' })}
        onCancel={this.handleClose}
        onOk={onSubmit}
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
            label={<FormattedMessage id="storage.name" />}
            required={true}
          >
            {getFieldDecorator('name', {
              rules: [fieldRequiredRule('name')]
            })(<Input />)}
          </FormItem>
          <FormItem
            label={<FormattedMessage id="storage.type" />}
            required={true}
          >
            {getFieldDecorator('type', {
              rules: [fieldRequiredRule('type')]
            })(
              <Select>
                <Option value="nfs">NFS</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label={<FormattedMessage id="storage.ip" />}
            required={true}
            hasFeedback={true}
          >
            {getFieldDecorator('ip', {
              rules: [
                fieldRequiredRule('ip'),
                {
                  validator: (_, value: string, callback) => {
                    if (validateIPv4(value)) {
                      callback();
                    } else {
                      callback(new Error('invalidated ip'));
                    }
                  },
                  message: <FormattedMessage id="storage.hint.invalidatedIP" />
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem
            label={<FormattedMessage id="storage.path" />}
            required={true}
            hasFeedback={true}
          >
            {getFieldDecorator('path', {
              rules: [
                fieldRequiredRule('path'),
                {
                  validator: (_, value: string, callback) => {
                    if (/^\/.*/.test(value)) {
                      callback();
                    } else {
                      callback(new Error('invalidated path'));
                    }
                  },
                  message: (
                    <FormattedMessage id="storage.hint.invalidatedPath" />
                  )
                }
              ]
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({
  onFieldsChange(props: StorageFormProps, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props: StorageFormProps) {
    return {
      name: Form.createFormField({
        ...props.name,
        value: props.name.value
      }),
      type: Form.createFormField({
        ...props.type,
        value: props.type.value
      }),
      ip: Form.createFormField({
        ...props.ip,
        value: props.ip.value
      }),
      path: Form.createFormField({
        ...props.path,
        value: props.path.value
      })
    };
  }
})(injectIntl(StorageForm));
