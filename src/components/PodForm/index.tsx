import * as React from 'react';
import * as PodModel from '@/models/Pod';
import * as NetworkModel from '@/models/Network';
import * as NamespaceModel from '@/models/Namespace';
import { findIndex } from 'lodash';
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
  allPods: Array<string>;
  pods: PodModel.Pods;
  networks: Array<NetworkModel.Network>;
  namespaces: Array<NamespaceModel.Namespace>;
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

class PodForm extends React.PureComponent<PodFormProps, any> {
  private labelKey: React.RefObject<Input>;
  private labelValue: React.RefObject<Input>;
  private envVarsKey: React.RefObject<Input>;
  private envVarsValue: React.RefObject<Input>;

  constructor(props: PodFormProps) {
    super(props);
    this.labelKey = React.createRef();
    this.labelValue = React.createRef();
    this.envVarsKey = React.createRef();
    this.envVarsValue = React.createRef();
    const key = Math.random()
      .toString(36)
      .substring(7);
    this.state = {
      labels: new Map(),
      envVars: new Map(),
      containerKey: key,
      networkKey: key,
      routeKey: key,
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
          routesGw: [
            {
              key,
              dstCIDR: '',
              gateway: ''
            }
          ]
        }
      ]
    };
  }

  public handleClose = () => {
    const key = Math.random()
      .toString(36)
      .substring(7);
    const state = {
      labels: new Map(),
      envVars: new Map(),
      containerKey: key,
      networkKey: key,
      routekKey: key,
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
          routesGw: [
            {
              key,
              dstCIDR: '',
              gateway: ''
            }
          ]
        }
      ]
    };
    this.setState(state);
    this.props.form.resetFields();
    this.props.onCancel();
  };

  protected handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const labels = {};
        if (values.labels) {
          Array.from(values.labels.keys()).map((key: string) => {
            labels[key] = values.labels.get(key);
          });
        }
        const envVars = {};
        if (values.envVars) {
          Array.from(values.envVars.keys()).map((key: string) => {
            envVars[key] = values.envVars.get(key);
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
            const routesGw: Array<PodModel.PodRouteGwRequest> = [];
            const routesIntf: Array<PodModel.PodRouteIntfRequest> = [];
            network.routesGw.map((route: PodModel.PodRouteGwRequest) => {
              const dstCIDR =
                values[`network-${network.key}-route-${route.key}-dstCIDR`];
              const gateway =
                values[`network-${network.key}-route-${route.key}-gateway`];
              if (dstCIDR !== '') {
                if (gateway !== '') {
                  routesGw.push({
                    dstCIDR,
                    gateway
                  });
                } else {
                  routesIntf.push({
                    dstCIDR
                  });
                }
              }
            });
            networks.push({
              name: values[`network-${network.key}-name`],
              ifName: values[`network-${network.key}-ifName`],
              ipAddress: values[`network-${network.key}-ipAddress`],
              netmask: values[`network-${network.key}-netmask`],
              vlan: values[`network-${network.key}-vlan`],
              routesGw,
              routesIntf
            });
          });
        }
        const podRequest: PodModel.PodRequest = {
          name: values.name,
          namespace: 'default',
          labels,
          envVars,
          containers,
          networks,
          networkType: values.networkType,
          restartPolicy: values.restartPolicy,
          capability: values.capability,
          volumes: [],
          nodeAffinity: []
        };
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

  protected checkInterfaceName = (rule: any, value: string, callback: any) => {
    if (value === 'eth0') {
      callback(`Invalid Name! "eth0" is already used by system`);
      return;
    }

    const re = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
    if (re.test(value)) {
      callback();
      return;
    }
    callback(
      `Invalid Name! Must consist of lower case alphanumeric characters, '-' or '.'`
    );
  };

  protected checkPodName = (rule: any, value: string, callback: any) => {
    this.props.allPods.map(name => {
      if (this.props.pods[name].podName === value) {
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

  protected checkContainerName = (rule: any, value: string, callback: any) => {
    let count = 0;
    const { getFieldValue } = this.props.form;
    this.state.containers.map((container: PodModel.PodContainerRequest) => {
      if (getFieldValue(`container-${container.key}-name`) === value) {
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

  protected handleCommandChange = (index: number, value: any) => {
    const { containers } = this.state;
    const newContainers = [...containers];
    newContainers[index].command = value;
    this.setState({ containers: newContainers });
  };

  protected addLabel = () => {
    if (
      this.labelKey.current != null &&
      this.labelValue.current != null &&
      this.labelKey.current.input.value !== '' &&
      this.labelValue.current.input.value !== ''
    ) {
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

  protected addEnvVars = () => {
    if (
      this.envVarsKey.current != null &&
      this.envVarsValue.current != null &&
      this.envVarsKey.current.input.value !== '' &&
      this.envVarsValue.current.input.value !== ''
    ) {
      const { envVars } = this.state;
      const newEnvVars = new Map(envVars);
      newEnvVars.set(
        this.envVarsKey.current.input.value,
        this.envVarsValue.current.input.value
      );
      this.envVarsKey.current.input.value = '';
      this.envVarsValue.current.input.value = '';
      this.setState({ envVars: newEnvVars });

      const { setFieldsValue } = this.props.form;
      setFieldsValue({
        envVars: newEnvVars
      });
    }
  };

  protected deleteEnvVars = (key: string) => {
    const { envVars } = this.state;
    const newEnvVars = new Map(envVars);
    newEnvVars.delete(key);
    this.setState({ envVars: newEnvVars });

    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      envVars: newEnvVars
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
      routesGw: [
        {
          key,
          dstCIDR: '',
          gateway: ''
        }
      ]
    });
    this.setState({ networks: newNetworks, networkKey: key, routeKey: key });
  };

  protected addRoute = (networkIndex: number) => {
    const { networks } = this.state;
    const newNetworks = [...networks];
    const key = Math.random()
      .toString(36)
      .substring(7);
    newNetworks[networkIndex].routesGw.push({
      key,
      dstCIDR: '',
      gateway: ''
    });
    this.setState({ networks: newNetworks, routeKey: key });
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

    let networkKey: string;
    let routeKey: string;
    const index = findIndex(
      newNetworks,
      (network: PodModel.PodNetworkRequest) => {
        return network.key === targetKey;
      }
    );
    if (index === newNetworks.length - 1) {
      networkKey = newNetworks[index - 1].key;
      routeKey = newNetworks[index - 1].routesGw[0].key;
    } else {
      networkKey = newNetworks[index + 1].key;
      routeKey = newNetworks[index + 1].routesGw[0].key;
    }
    newNetworks.splice(index, 1);

    this.setState({ networks: newNetworks, networkKey, routeKey });
  };

  protected deleteRoute = (targetKey: string) => {
    const { networks } = this.state;
    const newNetworks = [...networks];

    let key: string;
    let routeIndex: number = 0;
    const networkIndex = findIndex(
      newNetworks,
      (network: PodModel.PodNetworkRequest) => {
        for (const route of network.routesGw) {
          const result = route.key === targetKey;
          if (result) {
            return true;
          }
          routeIndex++;
        }
        return false;
      }
    );
    if (routeIndex === newNetworks[networkIndex].routesGw.length - 1) {
      key = newNetworks[networkIndex].routesGw[routeIndex - 1].key;
    } else {
      key = newNetworks[networkIndex].routesGw[routeIndex + 1].key;
    }
    newNetworks[networkIndex].routesGw.splice(routeIndex, 1);

    this.setState({ networks: newNetworks, routeKey: key });
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
    let routeKey: string = '';
    for (const network of this.state.networks) {
      if (network.key === networkKey) {
        routeKey = network.routesGw[0].key;
        break;
      }
    }
    this.setState({ networkKey, routeKey });
  };

  protected onChangeRoute = (routeKey: string) => {
    this.setState({ routeKey });
  };

  protected onChangeContainer = (containerKey: string) => {
    this.setState({ containerKey });
  };

  protected onEditNetwork = (targetKey: string, action: string) => {
    if (action === 'remove') {
      this.deleteNetwork(targetKey);
    }
  };

  protected onEditRoute = (targetKey: string, action: string) => {
    if (action === 'remove') {
      this.deleteRoute(targetKey);
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
        onCancel={this.handleClose}
      >
        <Form>
          <h2>Pod</h2>
          <FormItem {...formItemLayout} label={<FormattedMessage id="pod" />}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  validator: this.checkPodName
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
                    <Input
                      ref={this.labelKey}
                      placeholder="Key"
                      onBlur={this.addLabel}
                    />
                  </Col>
                  <Col span={10}>
                    <Input
                      ref={this.labelValue}
                      placeholder="Value"
                      onBlur={this.addLabel}
                    />
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
            label={<FormattedMessage id="pod.envVars" />}
          >
            {getFieldDecorator('envVars', {
              rules: [
                {
                  required: false
                }
              ]
            })(
              <div>
                {Array.from(this.state.envVars.keys()).map((key: string) => {
                  return (
                    <Row key={key}>
                      <Col span={10}>
                        <Input disabled={true} value={key} placeholder="Key" />
                      </Col>
                      <Col span={10}>
                        <Input
                          disabled={true}
                          value={this.state.envVars.get(key)}
                          placeholder="Value"
                        />
                      </Col>
                      <Button
                        style={{ marginLeft: 12 }}
                        shape="circle"
                        icon="close"
                        onClick={() => this.deleteEnvVars(key)}
                      />
                    </Row>
                  );
                })}
                <Row>
                  <Col span={10}>
                    <Input
                      ref={this.envVarsKey}
                      placeholder="Key"
                      onBlur={this.addEnvVars}
                    />
                  </Col>
                  <Col span={10}>
                    <Input
                      ref={this.envVarsValue}
                      placeholder="Value"
                      onBlur={this.addEnvVars}
                    />
                  </Col>
                  <Button
                    style={{ marginLeft: 12 }}
                    shape="circle"
                    icon="enter"
                    onClick={this.addEnvVars}
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
                        label={<FormattedMessage id="name" />}
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
                              validator: this.checkInterfaceName
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
                        label={<FormattedMessage id="network.VLANTags" />}
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
                          <Tabs
                            hideAdd={true}
                            type={
                              this.state.networks[index].routesGw.length > 1
                                ? 'editable-card'
                                : undefined
                            }
                            tabPosition="top"
                            activeKey={this.state.routeKey}
                            onChange={this.onChangeRoute}
                            onEdit={this.onEditRoute}
                            tabBarExtraContent={
                              <Button
                                shape="circle"
                                icon="plus"
                                onClick={() => this.addRoute(index)}
                              />
                            }
                          >
                            {this.state.networks[index].routesGw.map(
                              (
                                route: PodModel.PodRouteGwRequest,
                                routeIndex: number
                              ) => {
                                return (
                                  <TabPane
                                    key={route.key}
                                    tab={'Route' + (routeIndex + 1)}
                                  >
                                    <FormItem
                                      {...formItemLayout}
                                      label={
                                        <FormattedMessage id="network.dstCIDR" />
                                      }
                                    >
                                      {getFieldDecorator(
                                        `network-${network.key}-route-${
                                          route.key
                                        }-dstCIDR`,
                                        {
                                          rules: [
                                            {
                                              required: false,
                                              validator: this.checkCIDR
                                            }
                                          ],
                                          initialValue: ''
                                        }
                                      )(
                                        <Input placeholder="Destination CIDR" />
                                      )}
                                    </FormItem>
                                    <FormItem
                                      {...formItemLayout}
                                      label={
                                        <FormattedMessage id="network.gateway" />
                                      }
                                    >
                                      {getFieldDecorator(
                                        `network-${network.key}-route-${
                                          route.key
                                        }-gateway`,
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
                                  </TabPane>
                                );
                              }
                            )}
                          </Tabs>
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
                      label={<FormattedMessage id="name" />}
                    >
                      {getFieldDecorator(`container-${container.key}-name`, {
                        rules: [
                          {
                            required: true,
                            validator: this.checkContainerName
                          }
                        ]
                      })(<Input placeholder="Give a unique container name" />)}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label={<FormattedMessage id="image" />}
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
