import * as React from 'react';
import * as PodModel from '@/models/Pod';
import { get, findIndex } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Form,
  Button,
  Modal,
  Select,
  Input,
  InputNumber,
  Row,
  Col,
  Checkbox,
  Tabs,
  Collapse
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as Network from '@/models/Network';
import EditableTagGroup from '@/components/EditableTagGroup';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const Panel = Collapse.Panel;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
};

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
    const key = Math.random()
      .toString(36)
      .substring(7);
    this.state = {
      labels: new Map(),
      containerKey: key,
      networkKey: key,
      containers: [
        {
          key,
          name: '',
          image: '',
          command: []
        }
      ],
      networks: [
        {
          key,
          name: '',
          ifName: '',
          ipAddress: '',
          netmask: '',
          routes: [
            {
              dstCIDR: '',
              gateway: ''
            }
          ]
        }
      ]
    };
  }

  protected handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const labels = {};
        if (values.labels) {
          Array.from(values.labels.keys()).map((key: string) => {
            labels[key] = values.labels.get(key);
          });
        }
        const containers: Array<PodModel.PodContainerRequest> = [];
        this.state.containers.map((container: PodModel.PodContainerRequest) => {
          containers.push({
            name: values[`container-${container.key}-name`],
            image: values[`container-${container.key}-image`],
            command: container.command
          });
        });
        const networks: Array<PodModel.PodNetworkRequest> = [];
        if (values.networkType === 'custom') {
          this.state.networks.map((network: PodModel.PodNetworkRequest) => {
            const routes = [];
            const dstCIDR = values[`network-${network.key}-routes-dstCIDR`];
            const gateway = values[`network-${network.key}-routes-gateway`];
            if (dstCIDR !== '') {
              if (gateway !== '') {
                routes.push({
                  dstCIDR,
                  gateway
                });
              } else {
                routes.push({
                  dstCIDR
                });
              }
            }
            networks.push({
              name: values[`network-${network.key}-name`],
              ifName: values[`network-${network.key}-ifName`],
              ipAddress: values[`network-${network.key}-ipAddress`],
              netmask: values[`network-${network.key}-netmask`],
              vlan: values[`network-${network.key}-vlan`],
              routes
            });
          });
        }
        const podRequest: PodModel.PodRequest = {
          name: values.name,
          namespace: 'default',
          labels,
          containers,
          networks,
          networkType: values.networkType,
          restartPolicy: values.restartPolicy,
          capability: values.capability,
          volumes: [],
          nodeAffinity: []
        };
        console.log(podRequest);
        this.props.onSubmit(podRequest);
      }
    });
  };

  protected checkCommand = (value: number | string) => {
    return true;
  };

  protected checkCIDR = (rule: any, value: string, callback: any) => {
    const re = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/(3[0-2]|[1-2][0-9]|[0-9]))$/;
    if (value === '' || re.test(value)) {
      callback();
      return;
    }
    callback(`Invalid CIDR! For Example: "192.168.0.1/24", "10.1.14.32/24"`);
  };

  protected checkGateway = (rule: any, value: string, callback: any) => {
    const re = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    if (value === '' || re.test(value)) {
      callback();
      return;
    }
    callback(`Invalid Address! For Example: "192.168.0.1", "8.8.8.8"`);
  };

  protected checkIPAddress = (rule: any, value: string, callback: any) => {
    const re = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    if (re.test(value)) {
      callback();
      return;
    }
    callback(`Invalid Address! For Example: "192.168.0.1", "8.8.8.8"`);
  };

  protected checkName = (rule: any, value: string, callback: any) => {
    const re = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
    if (re.test(value)) {
      callback();
      return;
    }
    callback(
      `Invalid Name! Must consist of lower case alphanumeric characters, '-' or '.'`
    );
  };

  protected handleCommandChange = (index: number, value: any) => {
    const { containers } = this.state;
    const newContainers = [...containers];
    newContainers[index].command = value;
    this.setState({ containers: newContainers });
  };

  protected addLabel = () => {
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

      const { setFieldsValue } = this.props.form;
      setFieldsValue({
        labels: newLabels
      });
    }
  };

  protected deleteLabel = (key: string) => {
    const { labels } = this.state;
    const newLabels = new Map(labels);
    newLabels.delete(key);
    this.setState({ labels: newLabels });

    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      labels: newLabels
    });
  };

  protected addNetwork = () => {
    const { networks } = this.state;
    const newNetworks = [...networks];
    const key = Math.random()
      .toString(36)
      .substring(7);
    newNetworks.push({
      key,
      name: '',
      ifName: '',
      ipAddress: '',
      netmask: '',
      routes: [
        {
          dstCIDR: '',
          gateway: ''
        }
      ]
    });
    this.setState({ networks: newNetworks, networkKey: key });
  };

  protected addContainer = () => {
    const { containers } = this.state;
    const newContainers = [...containers];
    const key = Math.random()
      .toString(36)
      .substring(7);
    newContainers.push({
      key,
      name: '',
      image: '',
      command: []
    });
    this.setState({ containers: newContainers, containerKey: key });
  };

  protected deleteNetwork = (targetKey: string) => {
    const { networks } = this.state;
    const newNetworks = [...networks];

    let key: string;
    const index = findIndex(
      newNetworks,
      (network: PodModel.PodNetworkRequest) => {
        return network.key === targetKey;
      }
    );
    if (index === newNetworks.length - 1) {
      key = newNetworks[index - 1].key;
    } else {
      key = newNetworks[index + 1].key;
    }
    newNetworks.splice(index, 1);

    this.setState({ networks: newNetworks, networkKey: key });
  };

  protected deleteContainer = (targetKey: string) => {
    const { containers } = this.state;
    const newContainers = [...containers];

    let key: string;
    const index = findIndex(
      newContainers,
      (container: PodModel.PodContainerRequest) => {
        return container.key === targetKey;
      }
    );
    if (index === newContainers.length - 1) {
      key = newContainers[index - 1].key;
    } else {
      key = newContainers[index + 1].key;
    }
    newContainers.splice(index, 1);

    this.setState({ containers: newContainers, containerKey: key });
  };

  protected onChangeNetwork = (networkKey: string) => {
    this.setState({ networkKey });
  };

  protected onChangeContainer = (containerKey: string) => {
    this.setState({ containerKey });
  };

  protected onEditNetwork = (targetKey: string, action: string) => {
    if (action === 'remove') {
      this.deleteNetwork(targetKey);
    }
  };

  protected onEditContainer = (targetKey: string, action: string) => {
    if (action === 'remove') {
      this.deleteContainer(targetKey);
    }
  };

  public render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: 'hidden'
    };
    return (
      <Modal
        style={{ top: 20 }}
        visible={this.props.visible}
        title={<FormattedMessage id="pod.add" />}
        onOk={this.handleSubmit}
        onCancel={this.props.onCancel}
      >
        <Form>
          <h2>Pod</h2>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="pod.name" />}
          >
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  validator: this.checkName
                }
              ]
            })(<Input placeholder="Give a unique pod name" />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="pod.restartPolicy" />}
          >
            {getFieldDecorator('restartPolicy', {
              rules: [
                {
                  required: true,
                  message: 'Please select your restart policy'
                }
              ]
            })(
              <Select
                placeholder="Select a restart policy"
                style={{ width: 200 }}
              >
                <Option value="Always">Always</Option>
                <Option value="OnFailure">OnFailure</Option>
                <Option value="Never">Never</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="pod.labels" />}
          >
            {getFieldDecorator('labels', {
              rules: [
                {
                  required: false
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
                    onClick={this.addLabel}
                  />
                </Row>
              </div>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="pod.capability" />}
          >
            {getFieldDecorator('capability', {
              rules: [
                {
                  required: false
                }
              ],
              initialValue: false
            })(<Checkbox />)}
          </FormItem>
          <h2>Network</h2>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="network.selectType" />}
          >
            {getFieldDecorator('networkType', {
              rules: [
                {
                  required: true,
                  message: 'Please select your network type'
                }
              ]
            })(
              <Select
                placeholder="Select a network type"
                style={{ width: 200 }}
              >
                <Option value="host">Host Network</Option>
                <Option value="cluster">Cluster Network</Option>
                <Option
                  value="custom"
                  disabled={!(this.props.networks.length > 0)}
                >
                  Custom Network
                </Option>
              </Select>
            )}
          </FormItem>
          {getFieldValue('networkType') === 'custom' && (
            <Tabs
              hideAdd={true}
              type={
                this.state.networks.length > 1 ? 'editable-card' : undefined
              }
              tabPosition="top"
              activeKey={this.state.networkKey}
              onChange={this.onChangeNetwork}
              onEdit={this.onEditNetwork}
              tabBarExtraContent={
                <Button shape="circle" icon="plus" onClick={this.addNetwork} />
              }
            >
              {this.state.networks.map(
                (network: PodModel.PodNetworkRequest, index: number) => {
                  return (
                    <TabPane tab={'Network' + (index + 1)} key={network.key}>
                      <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="network.name" />}
                      >
                        {getFieldDecorator(`network-${network.key}-name`, {
                          rules: [
                            {
                              required: true,
                              message: 'Please select your network name'
                            }
                          ]
                        })(
                          <Select
                            placeholder="Select a network"
                            style={{ width: 200 }}
                          >
                            {this.props.networks.map(n => {
                              return (
                                <Option key={n.id} value={n.name}>
                                  {n.name}
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="network.interfaceName" />}
                      >
                        {getFieldDecorator(`network-${network.key}-ifName`, {
                          rules: [
                            {
                              required: true,
                              validator: this.checkName
                            }
                          ]
                        })(<Input placeholder="Interface Name" />)}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="network.ipAddress" />}
                      >
                        {getFieldDecorator(`network-${network.key}-ipAddress`, {
                          rules: [
                            {
                              required: true,
                              validator: this.checkIPAddress
                            }
                          ],
                          initialValue: ''
                        })(<Input placeholder="IP Address" />)}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="network.netmask" />}
                      >
                        {getFieldDecorator(`network-${network.key}-netmask`, {
                          rules: [
                            {
                              required: true,
                              validator: this.checkIPAddress
                            }
                          ],
                          initialValue: ''
                        })(<Input placeholder="Mask" />)}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="network.VLANTag" />}
                      >
                        {getFieldDecorator(`network-${network.key}-vlan`, {
                          rules: [
                            {
                              required: false
                            }
                          ]
                        })(
                          <InputNumber
                            min={0}
                            max={4095}
                            placeholder="VLAN Tag"
                          />
                        )}
                      </FormItem>
                      <Collapse bordered={false}>
                        <Panel style={customPanelStyle} header="Routes" key="1">
                          <FormItem
                            {...formItemLayout}
                            label={<FormattedMessage id="network.dstCIDR" />}
                          >
                            {getFieldDecorator(
                              `network-${network.key}-routes-dstCIDR`,
                              {
                                rules: [
                                  {
                                    required: false,
                                    validator: this.checkCIDR
                                  }
                                ],
                                initialValue: ''
                              }
                            )(<Input placeholder="Destination CIDR" />)}
                          </FormItem>
                          <FormItem
                            {...formItemLayout}
                            label={<FormattedMessage id="network.gateway" />}
                          >
                            {getFieldDecorator(
                              `network-${network.key}-routes-gateway`,
                              {
                                rules: [
                                  {
                                    required: false,
                                    validator: this.checkGateway
                                  }
                                ],
                                initialValue: ''
                              }
                            )(<Input placeholder="Gateway" />)}
                          </FormItem>
                        </Panel>
                      </Collapse>
                    </TabPane>
                  );
                }
              )}
            </Tabs>
          )}
          <h2>Container</h2>
          <Tabs
            hideAdd={true}
            type={
              this.state.containers.length > 1 ? 'editable-card' : undefined
            }
            tabPosition="top"
            activeKey={this.state.containerKey}
            onChange={this.onChangeContainer}
            onEdit={this.onEditContainer}
            tabBarExtraContent={
              <Button shape="circle" icon="plus" onClick={this.addContainer} />
            }
          >
            {this.state.containers.map(
              (container: PodModel.PodContainerRequest, index: number) => {
                return (
                  <TabPane tab={'Container' + (index + 1)} key={container.key}>
                    <FormItem
                      {...formItemLayout}
                      label={<FormattedMessage id="container.detail.name" />}
                    >
                      {getFieldDecorator(`container-${container.key}-name`, {
                        rules: [
                          {
                            required: true,
                            validator: this.checkName
                          }
                        ]
                      })(<Input placeholder="Give a unique container name" />)}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label={<FormattedMessage id="container.detail.image" />}
                    >
                      {getFieldDecorator(`container-${container.key}-image`, {
                        rules: [
                          {
                            required: true,
                            message: 'Please input your image'
                          }
                        ]
                      })(<Input placeholder="Input a image name" />)}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label={<FormattedMessage id="container.detail.command" />}
                    >
                      {getFieldDecorator(`container-${container.key}-command`, {
                        rules: [
                          {
                            required: false
                          }
                        ]
                      })(
                        <EditableTagGroup
                          tags={this.state.containers[index].command}
                          canRemoveAll={true}
                          onChange={this.handleCommandChange.bind(this, index)}
                          validator={this.checkCommand}
                          addMessage={
                            <FormattedMessage id="container.detail.newCommand" />
                          }
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

export default Form.create()(PodForm);
