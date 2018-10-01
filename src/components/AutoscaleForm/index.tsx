import * as React from 'react';
import * as DeploymentModel from '@/models/Deployment';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import { Form, Select, InputNumber, Button, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

type AutoscaleFormProps = OwnProps & InjectedIntlProps & FormComponentProps;

interface OwnProps {
  enable: boolean;
  namespace: string;
  controllerName: string;
  onSubmit: (data: DeploymentModel.Autoscale, enable: boolean) => void;
}

class AutoscaleForm extends React.PureComponent<AutoscaleFormProps, object> {
  constructor(props: AutoscaleFormProps) {
    super(props);
  }

  protected handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          namespace: this.props.namespace,
          scaleTargetRefName: this.props.controllerName,
          resourceName: values.resourceName,
          minReplicas: values.minReplicas,
          maxReplicas: values.maxReplicas,
          targetAverageUtilization: values.targetAverageUtilization
        };
        this.props.onSubmit(data, this.props.enable);
      }
    });
  };

  public render() {
    const { enable } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="deployment.autoscale.resource" />}
        >
          {getFieldDecorator('resourceName', {
            rules: [
              {
                required: enable
              }
            ]
          })(
            <Select
              disabled={!enable}
              style={{ width: 200 }}
              placeholder="Select a resource"
            >
              <Option value="cpu">CPU</Option>
              <Option value="memory">Memory</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="deployment.autoscale.average" />}
        >
          {getFieldDecorator('targetAverageUtilization', {
            rules: [
              {
                required: enable
              }
            ]
          })(<InputNumber disabled={!enable} min={1} max={100} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="deployment.autoscale.minReplicas" />}
        >
          {getFieldDecorator('minReplicas', {
            rules: [
              {
                required: enable
              }
            ]
          })(<InputNumber disabled={!enable} min={1} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="deployment.autoscale.maxReplicas" />}
        >
          {getFieldDecorator('maxReplicas', {
            rules: [
              {
                required: enable
              }
            ]
          })(<InputNumber disabled={!enable} min={1} />)}
        </FormItem>
        <Button style={{ float: 'right' }} onClick={this.handleSubmit}>
          <Icon type="save" />
          <FormattedMessage id="deployment.autoscale.save" />
        </Button>
      </Form>
    );
  }
}

export default compose<AutoscaleFormProps, OwnProps>(
  Form.create(),
  injectIntl
)(AutoscaleForm);
