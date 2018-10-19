import * as React from 'react';
import * as DeploymentModel from '@/models/Deployment';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import { Form, Select, InputNumber, Button, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { get, find } from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

type AutoscaleFormProps = OwnProps & InjectedIntlProps & FormComponentProps;

interface OwnProps {
  info: DeploymentModel.AutoscalerInfo | undefined;
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
    this.props.form.validateFields((err: any, values: any) => {
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
    const { enable, info } = this.props;
    const { getFieldDecorator } = this.props.form;
    const resourceList = [
      {
        name: 'CPU',
        value: 'cpu'
      },
      {
        name: 'Memory',
        value: 'memory'
      }
    ];
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="deployment.autoscale.resource" />}
        >
          {getFieldDecorator('resourceName', {
            initialValue: get(info, 'resourceName', undefined),
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
              {get(
                info,
                'isCapableAutoscaleResources',
                new Array<string>()
              ).map(resource => {
                const name = get(
                  find(resourceList, { value: resource }),
                  'name',
                  ''
                );
                return (
                  <Option key={resource} value={resource}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="deployment.autoscale.average" />}
        >
          {getFieldDecorator('targetAverageUtilization', {
            initialValue: get(info, 'targetAverageUtilization', 0),
            rules: [
              {
                required: enable
              }
            ]
          })(
            <InputNumber
              min={0}
              max={100}
              disabled={!enable}
              formatter={value => `${value} %`}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="deployment.autoscale.minReplicas" />}
        >
          {getFieldDecorator('minReplicas', {
            initialValue: get(info, 'minReplicas', 0),
            rules: [
              {
                required: enable
              }
            ]
          })(<InputNumber disabled={!enable} min={0} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="deployment.autoscale.maxReplicas" />}
        >
          {getFieldDecorator('maxReplicas', {
            initialValue: get(info, 'maxReplicas', 0),
            rules: [
              {
                required: enable
              }
            ]
          })(<InputNumber disabled={!enable} min={0} />)}
        </FormItem>
        <FormItem>
          <Button style={{ float: 'right' }} onClick={this.handleSubmit}>
            <Icon type="save" />
            <FormattedMessage id="deployment.autoscale.save" />
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default compose<AutoscaleFormProps, OwnProps>(
  Form.create(),
  injectIntl
)(AutoscaleForm);
