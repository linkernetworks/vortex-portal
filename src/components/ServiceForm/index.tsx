import * as React from 'react';
import * as ServiceModel from '@/models/Service';
import { findIndex } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Form,
  Button,
  Modal,
  Radio,
  Input,
  InputNumber,
  Row,
  Col,
  Tabs
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
};

interface ServiceFormProps extends FormComponentProps {
  services: Array<ServiceModel.Service>;
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

class ServiceForm extends React.PureComponent<ServiceFormProps, any> {
  private selectorKey: React.RefObject<Input>;
  private selectorValue: React.RefObject<Input>;

  constructor(props: ServiceFormProps) {
    super(props);
    this.selectorKey = React.createRef();
    this.selectorValue = React.createRef();
    const key = Math.random()
      .toString(36)
      .substring(7);
    this.state = {
      selectors: new Map(),
      portKey: key,
      ports: [
        {
          key,
          name: '',
          port: 0,
          targetPort: 0,
          nodePort: 0
        }
      ]
    };
  }

  protected checkPortName = (rule: any, value: string, callback: any) => {
    let count = 0;
    const { getFieldValue } = this.props.form;
    this.state.ports.map((port: ServiceModel.ServicePort) => {
      if (getFieldValue(`port-${port.key}-name`) === value) {
        count++;
      }
      if (count === 2) {
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

  protected checkServiceName = (rule: any, value: string, callback: any) => {
    this.props.services.map(service => {
      if (service.name === value) {
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

  protected addSelector = () => {
    if (
      this.selectorKey.current != null &&
      this.selectorValue.current != null
    ) {
      const { selectors } = this.state;
      const newSelectors = new Map(selectors);
      newSelectors.set(
        this.selectorKey.current.input.value,
        this.selectorValue.current.input.value
      );
      this.selectorKey.current.input.value = '';
      this.selectorValue.current.input.value = '';
      this.setState({ selectors: newSelectors });

      const { setFieldsValue } = this.props.form;
      setFieldsValue({
        selectors: newSelectors
      });
    }
  };

  protected deleteSelector = (key: string) => {
    const { selectors } = this.state;
    const newSelectors = new Map(selectors);
    newSelectors.delete(key);
    this.setState({ selectors: newSelectors });

    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      selectors: newSelectors
    });
  };

  protected addPort = () => {
    const { ports } = this.state;
    const newPorts = [...ports];
    const key = Math.random()
      .toString(36)
      .substring(7);
    newPorts.push({
      key,
      name: '',
      port: 0,
      targetPort: 0,
      nodePort: 0
    });
    this.setState({ ports: newPorts, portKey: key });
  };

  protected deletePort = (targetKey: string) => {
    const { ports } = this.state;
    const newPorts = [...ports];

    let key: string;
    const index = findIndex(newPorts, (port: ServiceModel.ServicePort) => {
      return port.key === targetKey;
    });
    if (index === newPorts.length - 1) {
      key = newPorts[index - 1].key;
    } else {
      key = newPorts[index + 1].key;
    }
    newPorts.splice(index, 1);

    this.setState({ ports: newPorts, portKey: key });
  };

  protected handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const selector = {};
        if (values.selectors) {
          Array.from(values.selectors.keys()).map((key: string) => {
            selector[key] = values.selectors.get(key);
          });
        }
        const ports: Array<ServiceModel.ServicePort> = [];
        this.state.ports.map((port: ServiceModel.ServicePort) => {
          ports.push({
            name: values[`port-${port.key}-name`],
            port: values[`port-${port.key}-port`],
            targetPort: values[`port-${port.key}-targetPort`],
            nodePort: values[`port-${port.key}-nodePort`]
          });
        });
        const service: ServiceModel.Service = {
          name: values.name,
          namespace: 'default',
          type: values.type,
          selector,
          ports
        };
        this.props.onSubmit(service);
      }
    });
  };

  protected handleClose = () => {
    const key = Math.random()
      .toString(36)
      .substring(7);
    const state = {
      selectors: new Map(),
      portKey: key,
      ports: [
        {
          key,
          name: '',
          port: 0,
          targetPort: 0,
          nodePort: 0
        }
      ]
    };
    this.setState(state);
    this.props.form.resetFields();
    this.props.onCancel();
  };

  protected onChangePort = (portKey: string) => {
    this.setState({ portKey });
  };

  protected onEditPort = (targetKey: string, action: string) => {
    if (action === 'remove') {
      this.deletePort(targetKey);
    }
  };

  public render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        visible={this.props.visible}
        title={<FormattedMessage id="service.add" />}
        onOk={this.handleSubmit}
        onCancel={this.handleClose}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="service.name" />}
          >
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  validator: this.checkServiceName
                }
              ]
            })(<Input placeholder="Give a unique service name" />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="service.type" />}
          >
            {getFieldDecorator('type', {
              rules: [
                {
                  required: true,
                  message: 'Please select your type'
                }
              ]
            })(
              <RadioGroup buttonStyle="solid">
                <RadioButton value="ClusterIP">Cluster IP</RadioButton>
                <RadioButton value="NodePort">Node Port</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="service.selectors" />}
          >
            {getFieldDecorator('selectors', {
              rules: [
                {
                  required: false
                }
              ]
            })(
              <div>
                {Array.from(this.state.selectors.keys()).map((key: string) => {
                  return (
                    <Row key={key}>
                      <Col span={10}>
                        <Input disabled={true} value={key} placeholder="Key" />
                      </Col>
                      <Col span={10}>
                        <Input
                          disabled={true}
                          value={this.state.selectors.get(key)}
                          placeholder="Value"
                        />
                      </Col>
                      <Button
                        style={{ marginLeft: 12 }}
                        shape="circle"
                        icon="close"
                        onClick={() => this.deleteSelector(key)}
                      />
                    </Row>
                  );
                })}
                <Row>
                  <Col span={10}>
                    <Input ref={this.selectorKey} placeholder="Key" />
                  </Col>
                  <Col span={10}>
                    <Input ref={this.selectorValue} placeholder="Value" />
                  </Col>
                  <Button
                    style={{ marginLeft: 12 }}
                    shape="circle"
                    icon="enter"
                    onClick={this.addSelector}
                  />
                </Row>
              </div>
            )}
          </FormItem>
          <Tabs
            hideAdd={true}
            type={this.state.ports.length > 1 ? 'editable-card' : undefined}
            tabPosition="top"
            activeKey={this.state.portKey}
            onChange={this.onChangePort}
            onEdit={this.onEditPort}
            tabBarExtraContent={
              <Button shape="circle" icon="plus" onClick={this.addPort} />
            }
          >
            {this.state.ports.map(
              (port: ServiceModel.ServicePort, index: number) => {
                return (
                  <TabPane tab={'Port' + (index + 1)} key={port.key}>
                    <FormItem
                      {...formItemLayout}
                      label={<FormattedMessage id="service.ports.name" />}
                    >
                      {getFieldDecorator(`port-${port.key}-name`, {
                        rules: [
                          {
                            required: true,
                            validator: this.checkPortName
                          }
                        ]
                      })(<Input placeholder="Give a unique port name" />)}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label={<FormattedMessage id="service.ports.port" />}
                    >
                      {getFieldDecorator(`port-${port.key}-port`, {
                        rules: [
                          {
                            required: true,
                            message: 'Please input your port'
                          }
                        ]
                      })(<InputNumber min={0} placeholder="Port" />)}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label={<FormattedMessage id="service.ports.targetPort" />}
                    >
                      {getFieldDecorator(`port-${port.key}-targetPort`, {
                        rules: [
                          {
                            required: true,
                            message: 'Please input your target port'
                          }
                        ]
                      })(<InputNumber min={0} placeholder="Taget Port" />)}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label={<FormattedMessage id="service.ports.nodePort" />}
                    >
                      {getFieldDecorator(`port-${port.key}-nodePort`, {
                        rules: [
                          {
                            required: true,
                            message: 'Please input your node port'
                          }
                        ]
                      })(
                        <InputNumber
                          min={30000}
                          max={33000}
                          placeholder="Node Port"
                        />
                      )}
                    </FormItem>
                  </TabPane>
                );
              }
            )}
          </Tabs>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ServiceForm);
