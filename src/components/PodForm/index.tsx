import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Form,
  Button,
  Icon,
  Modal,
  Dropdown,
  Select,
  Input,
  Radio,
  Tag,
  InputNumber,
  Row,
  Col
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { FormField } from '@/utils/types';
import * as Pod from '@/models/Pod';
import * as Network from '@/models/Network';
import EditableTagGroup from '@/components/EditableTagGroup';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

interface PodFormProps extends FormComponentProps {
  networks: Array<Network.Network>;
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

class PodForm extends React.PureComponent<PodFormProps, any> {
  private labelKey: React.RefObject<Input>;
  private labelValue: React.RefObject<Input>;

  constructor(props: PodFormProps) {
    super(props);
    this.labelKey = React.createRef();
    this.labelValue = React.createRef();
    this.state = {
      commands: {
        value: []
      },
      labels: new Map(),
      networkName: '',
      netMask: '',
      ipAddress: '',
      interfaceName: '',
      image: '',
      podName: '',
      containerName: ''
    };
  }

  protected checkCommand = (value: number | string) => {
    return true;
  };

  protected newLabel = () => {
    if (this.labelKey.current != null && this.labelValue.current != null) {
      const { labels } = this.state;
      const newLabels = new Map(labels);
      newLabels.set(
        this.labelKey.current.input.value,
        this.labelValue.current.input.value
      );
      this.labelKey.current.input.value = '';
      this.labelValue.current.input.value = '';
      this.setState({ labels: newLabels });
    }
  };

  protected deleteLabel = (key: string) => {
    const { labels } = this.state;
    const newLabels = new Map(labels);
    newLabels.delete(key);
    this.setState({ labels: newLabels });
  };

  protected handleRawFieldChange = (
    field: string,
    e: React.FormEvent<HTMLInputElement>
  ) => {
    const { value } = e.currentTarget;
    const changed = {};
    changed[field] = value;
    this.setState(changed);
  };

  protected handleCommandChange = (field: string, value: any) => {
    const changed = {};
    changed[field] = { ...this.state[field], value };
    this.setState(changed);
  };

  protected handleChange = (field: string, value: any) => {
    const changed = {};
    changed[field] = value;
    this.setState(changed);
  };

  public render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        style={{ top: 20 }}
        visible={this.props.visible}
        title={<FormattedMessage id="pod.add" />}
        onOk={() => this.props.onSubmit(this.state)}
        onCancel={this.props.onCancel}
      >
        <Form>
          <h2>Pod</h2>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="pod.name" />}
          >
            {getFieldDecorator('podName', {
              rules: [
                {
                  required: true,
                  message: 'Please input your pod name'
                }
              ]
            })(
              <Input
                onChange={this.handleRawFieldChange.bind(this, 'podName')}
                placeholder="Give a unique pod name"
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="pod.labels" />}
          >
            {getFieldDecorator('labels', {
              rules: [
                {
                  required: true,
                  message: 'Please input your labels'
                }
              ]
            })(
              <div>
                {Array.from(this.state.labels.keys()).map((key: string) => {
                  return (
                    <Row key={key}>
                      <Col span={10}>
                        <Input disabled={true} value={key} placeholder="Key" />
                      </Col>
                      <Col span={10}>
                        <Input
                          disabled={true}
                          value={this.state.labels.get(key)}
                          placeholder="Value"
                        />
                      </Col>
                      <Button
                        style={{ marginLeft: 12 }}
                        shape="circle"
                        icon="close"
                        onClick={() => this.deleteLabel(key)}
                      />
                    </Row>
                  );
                })}
                <Row>
                  <Col span={10}>
                    <Input ref={this.labelKey} placeholder="Key" />
                  </Col>
                  <Col span={10}>
                    <Input ref={this.labelValue} placeholder="Value" />
                  </Col>
                  <Button
                    style={{ marginLeft: 12 }}
                    shape="circle"
                    icon="enter"
                    onClick={this.newLabel}
                  />
                </Row>
              </div>
            )}
          </FormItem>
          <h2>Container</h2>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="container.detail.name" />}
          >
            {getFieldDecorator('containerName', {
              rules: [
                {
                  required: true,
                  message: 'Please input your container name'
                }
              ]
            })(
              <Input
                onChange={this.handleRawFieldChange.bind(this, 'containerName')}
                placeholder="Give a unique container name"
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="container.detail.image" />}
          >
            {getFieldDecorator('image', {
              rules: [
                {
                  required: true,
                  message: 'Please input your image'
                }
              ]
            })(
              <Input
                onChange={this.handleRawFieldChange.bind(this, 'image')}
                placeholder="Input a image name"
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="container.detail.command" />}
          >
            <EditableTagGroup
              tags={this.state.commands.value}
              canRemoveAll={true}
              onChange={this.handleCommandChange.bind(this, 'commands')}
              validator={this.checkCommand}
              addMessage={<FormattedMessage id="container.detail.newCommand" />}
            />
          </FormItem>
          <h2>Network</h2>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="network.name" />}
          >
            {getFieldDecorator('networkName', {
              rules: [
                {
                  required: true,
                  message: 'Please select your network'
                }
              ]
            })(
              <Select
                onChange={this.handleChange.bind(this, 'networkName')}
                placeholder="Select a network"
                style={{ width: 200 }}
              >
                <Option value="hostNetwork">Host Network</Option>
                <Option value="clusterNetwork">Cluster Network</Option>
                {this.props.networks.map(network => {
                  return (
                    <Option key={network.id} value={network.name}>
                      {network.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          {this.state.networkName !== 'hostNetwork' &&
            this.state.networkName !== 'clusterNetwork' &&
            this.state.networkName !== '' && (
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="network.interfaceName" />}
              >
                {getFieldDecorator('interfaceName', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your interface name'
                    }
                  ]
                })(
                  <Input
                    onChange={this.handleRawFieldChange.bind(
                      this,
                      'interfaceName'
                    )}
                    placeholder="Interface Name"
                  />
                )}
              </FormItem>
            )}
          {this.state.networkName !== 'hostNetwork' &&
            this.state.networkName !== 'clusterNetwork' &&
            this.state.networkName !== '' && (
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="network.VLANTag" />}
              >
                <InputNumber
                  onChange={this.handleChange.bind(this, 'VLANTag')}
                  placeholder="VLAN Tag"
                />
              </FormItem>
            )}
          {this.state.networkName !== 'hostNetwork' &&
            this.state.networkName !== 'clusterNetwork' &&
            this.state.networkName !== '' && (
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="network.ipAddress" />}
              >
                {getFieldDecorator('ipAddress', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your ip address'
                    }
                  ]
                })(
                  <Input
                    onChange={this.handleRawFieldChange.bind(this, 'ipAddress')}
                    placeholder="IP Address"
                  />
                )}
              </FormItem>
            )}
          {this.state.networkName !== 'hostNetwork' &&
            this.state.networkName !== 'clusterNetwork' &&
            this.state.networkName !== '' && (
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="network.netmask" />}
              >
                {getFieldDecorator('netMask', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your mask'
                    }
                  ]
                })(
                  <Input
                    onChange={this.handleRawFieldChange.bind(this, 'netMask')}
                    placeholder="Mask"
                  />
                )}
              </FormItem>
            )}
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(PodForm);
