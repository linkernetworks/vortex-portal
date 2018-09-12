import * as React from 'react';
import * as PodModel from '@/models/Pod';
import * as ContainerModel from '@/models/Container';
import { findIndex, last } from 'lodash';
import {
  Row,
  Col,
  Tag,
  Drawer,
  Button,
  Icon,
  Tabs,
  Table,
  notification,
  Popconfirm,
  Radio
} from 'antd';
import * as moment from 'moment';
import { FormattedMessage } from 'react-intl';
import * as podAPI from '@/services/pod';
import * as containerAPI from '@/services/container';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

import * as styles from './styles.module.scss';

const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

interface PodDrawerProps {
  pod: PodModel.Pod;
  podNics: PodModel.NICS;
  visiblePodDrawer: boolean;
  hideMorePod: () => void;
  removePodByName: (namespace: string, id: string) => any;
}

interface PodDrawerState {
  podNics: PodModel.NICS;
  visibleContainerDrawer: boolean;
  currentContainer: ContainerModel.Container;
  containers: Array<ContainerModel.Container>;
  podTimeUnit: string;
  containerTimeUnit: string;
  resource: ContainerModel.Resource;
}

class PodDrawer extends React.PureComponent<PodDrawerProps, PodDrawerState> {
  private intervalContainersId: Array<number> = [];
  constructor(props: PodDrawerProps) {
    super(props);
    this.state = {
      visibleContainerDrawer: false,
      currentContainer: {
        detail: {
          containerName: '',
          createAt: 0,
          status: '',
          restartCount: '',
          pod: '',
          namespace: '',
          node: '',
          image: '',
          command: []
        },
        resource: {
          cpuUsagePercentage: [],
          memoryUsageBytes: []
        }
      } as ContainerModel.Container,
      containers: [],
      podNics: {},
      podTimeUnit: 'now',
      containerTimeUnit: 'now',
      resource: {
        cpuUsagePercentage: [],
        memoryUsageBytes: []
      }
    };
  }

  public componentDidUpdate(prevProps: PodDrawerProps) {
    const { pod } = this.props;
    if (pod.podName !== prevProps.pod.podName) {
      this.intervalContainersId.map(id => {
        clearInterval(id);
      });
      this.intervalContainersId = [];
      pod.containers.map(container => {
        // Only show in pod's container drawer so get container data without flow
        const containers: Array<ContainerModel.Container> = [];
        containerAPI.getContainer(pod.podName, container).then(res => {
          containers.push(res.data);
          this.setState({ containers });
        });
        const id = window.setInterval(
          () => this.fetchContainer(pod.podName, container),
          5000
        );
        this.intervalContainersId.push(id);
      });
    }
  }

  public componentDidMount() {
    const tmpId = window.setInterval(() => {
      const { pod } = this.props;
      if (!!pod) {
        pod.containers.map(container => {
          // Only show in pod's container drawer so get container data without flow
          const containers: Array<ContainerModel.Container> = [];
          containerAPI.getContainer(pod.podName, container).then(res => {
            containers.push(res.data);
            this.setState({ containers });
          });
          const id = window.setInterval(
            () => this.fetchContainer(pod.podName, container),
            5000
          );
          this.intervalContainersId.push(id);
        });
        clearInterval(tmpId);
      }
    }, 1000);
  }

  public componentWillUnmount() {
    this.intervalContainersId.map(id => {
      clearInterval(id);
    });
  }

  protected showMoreContainer = (container: ContainerModel.Container) => {
    this.setState({
      visibleContainerDrawer: true,
      currentContainer: container
    });
  };

  protected hideMoreContainer = () => {
    this.setState({ visibleContainerDrawer: false });
  };

  protected fetchContainer = (pod: string, container: string) => {
    const containers = [...this.state.containers];
    containerAPI.getContainer(pod, container).then(res => {
      const newContainer = res.data;
      const index = findIndex(containers, c => {
        return c.detail.containerName === newContainer.detail.containerName;
      });
      if (index !== -1) {
        const originContainer = containers[index];

        const cpuUsagePercentage = last(
          originContainer.resource.cpuUsagePercentage
        );
        if (newContainer.resource.cpuUsagePercentage) {
          newContainer.resource.cpuUsagePercentage.map(data => {
            if (
              cpuUsagePercentage &&
              data.timestamp > cpuUsagePercentage.timestamp
            ) {
              originContainer.resource.cpuUsagePercentage.push(data);
              if (originContainer.resource.cpuUsagePercentage.length > 15) {
                originContainer.resource.cpuUsagePercentage.shift();
              }
            }
          });
        }

        const memoryUsageBytes = last(
          originContainer.resource.memoryUsageBytes
        );
        if (newContainer.resource.memoryUsageBytes) {
          newContainer.resource.memoryUsageBytes.map(data => {
            if (
              memoryUsageBytes &&
              data.timestamp > memoryUsageBytes.timestamp
            ) {
              originContainer.resource.memoryUsageBytes.push(data);
              if (originContainer.resource.memoryUsageBytes.length > 15) {
                originContainer.resource.memoryUsageBytes.shift();
              }
            }
          });
        }
      } else {
        containers.push(newContainer);
      }
    });
    this.setState({ containers });
  };

  protected handleRemovePod = (namespace: string, id: string) => {
    this.props.removePodByName(namespace, id);
    return notification.success({
      message: 'Success',
      description: 'Delete the pod successfully.'
    });
  };

  protected renderListItemContent = (
    title: string | React.ReactNode,
    content: string | React.ReactNode
  ) => {
    return (
      <div className={styles.column}>
        <div className="title">{title}</div>
        <div className="content">{content}</div>
      </div>
    );
  };

  protected renderStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
      case 'ready':
      case 'Completed':
        return <Icon type="check-circle" className={styles.readyIcon} />;
      case 'ContainerCreating':
        return <Icon type="clock-circle" className={styles.pendIcon} />;
      default:
        return <Icon type="close-circle" className={styles.errorIcon} />;
    }
  };

  protected renderLabels = (labels: Map<string, string>) => {
    return (
      <div className={styles.labels}>
        {Object.keys(labels).map(key => (
          <Tag color="blue" className={styles.label} key={key}>
            {key} : {labels[key]}
          </Tag>
        ))}
      </div>
    );
  };

  protected renderDetail = () => {
    const { pod } = this.props;
    if (!pod) {
      return <div />;
    }
    return (
      <div>
        <Row>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="status" />,
              pod.status
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="createdAt" />,
              moment(pod.createAt * 1000).calendar()
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="pod.ip" />,
              pod.ip
            )}
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="namespace" />,
              pod.namespace
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="pod.createByName" />,
              pod.createByName
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="pod.restartCount" />,
              pod.restartCount
            )}
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="node" />,
              pod.node
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="pod.createByKind" />,
              pod.createByKind
            )}
          </Col>
        </Row>
      </div>
    );
  };

  protected renderContainer = () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'detail.containerName',
        key: 'name'
      },
      {
        title: 'Status',
        dataIndex: 'detail.status',
        key: 'status'
      },
      {
        title: 'Namespace',
        dataIndex: 'detail.namespace',
        key: 'namespace'
      },
      {
        title: 'Image',
        dataIndex: 'detail.image',
        key: 'image'
      },
      {
        title: <FormattedMessage id="action" />,
        key: 'action',
        render: (text: string, record: ContainerModel.Container) => (
          <a onClick={() => this.showMoreContainer(record)}>
            {<FormattedMessage id="action.more" />}
          </a>
        )
      }
    ];
    return (
      <Table
        size="middle"
        columns={columns}
        dataSource={this.state.containers}
        pagination={false}
      />
    );
  };

  protected renderContainerDetail = (container: ContainerModel.Detail) => {
    return (
      <div>
        <Row>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`status`} />,
              container.status
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`namespace`} />,
              container.namespace
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.detail.image`} />,
              container.image
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`createdAt`} />,
              moment(container.createAt * 1000).calendar()
            )}
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`node`} />,
              container.node
            )}
          </Col>
        </Row>
      </div>
    );
  };

  protected renderCommands = (command: Array<string>) => {
    return (
      <div className={styles.commands}>
        {(command != null &&
          command.map(c => (
            <Tag color="green" className={styles.command} key={c}>
              {c}
            </Tag>
          ))) ||
          (command == null && 'null')}
      </div>
    );
  };

  protected renderResource = (resource: ContainerModel.Resource) => {
    if (this.state.containerTimeUnit !== 'now') {
      resource = this.state.resource;
    }
    return (
      <div>
        <RadioGroup
          className={styles.radioGroup}
          defaultValue="now"
          buttonStyle="solid"
          onChange={this.handleSwitchContainerTimeUnit}
        >
          <RadioButton value="week">Week</RadioButton>
          <RadioButton value="day">Day</RadioButton>
          <RadioButton value="now">Now</RadioButton>
        </RadioGroup>
        <Row>
          <Col span={24}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.resource.cpuUsagePercentage`} />,
              <div>
                {this.renderContainerChart(resource.cpuUsagePercentage, false)}
              </div>
            )}
          </Col>
          <Col span={24}>
            {this.renderListItemContent(
              <FormattedMessage
                id={`container.resource.memoryUsageMegabyte`}
              />,
              <div>
                {this.renderContainerChart(resource.memoryUsageBytes, true)}
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  };

  protected handleSwitchPodTimeUnit = (e: any) => {
    const { pod } = this.props;
    const podTimeUnit = e.target.value;
    if (podTimeUnit !== 'now') {
      podAPI.getPod(pod.podName, podTimeUnit).then(res => {
        this.setState({ podNics: res.data.nics, podTimeUnit });
      });
    } else {
      this.setState({ podTimeUnit });
    }
  };

  protected renderPodChart(
    data1: Array<{ timestamp: number; value: string }>,
    data2: Array<{ timestamp: number; value: string }>,
    toMB: boolean
  ) {
    const chartData: Array<{ x: string; y1: number; y2: number }> = [];
    if (data1.length === data2.length) {
      data1.map((d, i) => {
        const y1 = parseFloat(data1[i].value);
        const y2 = parseFloat(data2[i].value);
        if (toMB) {
          chartData.push({
            x: moment(d.timestamp * 1000).calendar(),
            y1: parseFloat((y1 / (1024 * 1024)).toFixed(2)),
            y2: parseFloat((y2 / (1024 * 1024)).toFixed(2))
          });
        } else {
          chartData.push({
            x: moment(d.timestamp * 1000).calendar(),
            y1,
            y2
          });
        }
      });
    }
    return (
      <LineChart
        width={600}
        height={300}
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="x" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line
          dot={false}
          type="monotone"
          name="Receive Usage"
          dataKey="y1"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          dot={false}
          type="monotone"
          name="Transmit Usage"
          dataKey="y2"
          stroke="#82ca9d"
        />
      </LineChart>
    );
  }

  protected handleSwitchContainerTimeUnit = (e: any) => {
    const containerTimeUnit = e.target.value;

    const { pod } = this.props;
    const { currentContainer } = this.state;

    if (containerTimeUnit !== 'now') {
      containerAPI
        .getContainer(
          pod.podName,
          currentContainer.detail.containerName,
          containerTimeUnit
        )
        .then(res => {
          this.setState({ resource: res.data.resource, containerTimeUnit });
        });
    } else {
      this.setState({ containerTimeUnit });
    }
  };

  protected renderContainerChart(
    data: Array<{ timestamp: number; value: string }>,
    toMB: boolean
  ) {
    const chartData: Array<{ x: string; y1: number }> = [];
    if (data !== null && data.length > 0) {
      data.map(d => {
        const y1 = parseFloat(d.value);
        if (toMB) {
          chartData.push({
            x: moment(d.timestamp * 1000).calendar(),
            y1: parseFloat((y1 / (1024 * 1024)).toFixed(2))
          });
        } else {
          chartData.push({
            x: moment(d.timestamp * 1000).calendar(),
            y1
          });
        }
      });
    }
    return (
      <LineChart
        width={600}
        height={300}
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="x" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line
          dot={false}
          type="monotone"
          name="Usage"
          dataKey="y1"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    );
  }

  protected renderInterface = (nics: PodModel.NICS) => {
    if (!nics) {
      return <div />;
    }
    if (this.state.podTimeUnit !== 'now') {
      nics = this.state.podNics;
    }
    return (
      <Tabs>
        {Object.keys(nics).map(name => (
          <TabPane tab={name} key={name}>
            <RadioGroup
              className={styles.radioGroup}
              defaultValue="now"
              buttonStyle="solid"
              onChange={this.handleSwitchPodTimeUnit}
            >
              <RadioButton value="week">Week</RadioButton>
              <RadioButton value="day">Day</RadioButton>
              <RadioButton value="now">Now</RadioButton>
            </RadioGroup>
            <Row>
              <Col span={24}>
                {this.renderListItemContent(
                  <FormattedMessage id="pod.nicNetworkTraffic.TXRXMegabyteTotal" />,
                  <div>
                    {this.renderPodChart(
                      nics[name].nicNetworkTraffic.receiveBytesTotal,
                      nics[name].nicNetworkTraffic.transmitBytesTotal,
                      true
                    )}
                  </div>
                )}
              </Col>
              <Col span={24}>
                {this.renderListItemContent(
                  <FormattedMessage id="pod.nicNetworkTraffic.TXRXPacketsTotal" />,
                  <div>
                    {this.renderPodChart(
                      nics[name].nicNetworkTraffic.receivePacketsTotal,
                      nics[name].nicNetworkTraffic.transmitPacketsTotal,
                      false
                    )}
                  </div>
                )}
              </Col>
            </Row>
          </TabPane>
        ))}
      </Tabs>
    );
  };

  protected renderAction = (pod: PodModel.Pod) => {
    if (pod !== undefined) {
      return (
        <Popconfirm
          key="action.delete"
          title={<FormattedMessage id="action.confirmToDelete" />}
          onConfirm={this.handleRemovePod.bind(
            this,
            pod.namespace,
            pod.podName
          )}
        >
          <Button>
            <Icon type="delete" /> <FormattedMessage id="pod.delete" />
          </Button>
        </Popconfirm>
      );
    } else {
      return (
        <Button type="dashed" disabled={true}>
          <Icon type="delete" /> <FormattedMessage id="pod.undeletable" />
        </Button>
      );
    }
  };

  public render() {
    const { currentContainer } = this.state;
    const { pod, podNics } = this.props;
    return (
      <Drawer
        title="Pod"
        width={720}
        closable={false}
        onClose={() => {
          this.props.hideMorePod();
          this.setState({ podTimeUnit: 'now' });
        }}
        visible={this.props.visiblePodDrawer}
      >
        <div className={styles.contentSection}>
          <h2 style={{ display: 'inline' }}>{!!pod && pod.podName}</h2>
          {!!pod && this.renderStatusIcon(pod.status)}
        </div>

        <div className={styles.contentSection}>
          <h3>Details</h3>
          {this.renderDetail()}
        </div>

        <div className={styles.contentSection}>
          <h3>Labels</h3>
          {!!pod &&
            this.renderListItemContent(
              <FormattedMessage id="pod.labels" />,
              this.renderLabels(pod.labels)
            )}
        </div>

        <div className={styles.contentSection}>
          <h3>Containers</h3>
          {this.renderContainer()}
        </div>

        <h3>Interface</h3>
        {this.renderInterface(podNics)}

        <Drawer
          title="Container"
          width={720}
          closable={false}
          onClose={this.hideMoreContainer}
          visible={this.state.visibleContainerDrawer}
        >
          <div className={styles.contentSection}>
            <h2 style={{ display: 'inline' }}>
              {currentContainer.detail.containerName}
            </h2>
            {this.renderStatusIcon(currentContainer.detail.status)}
          </div>

          <div className={styles.contentSection}>
            <h3>Detail</h3>
            {this.renderContainerDetail(currentContainer.detail)}
          </div>

          <div className={styles.contentSection}>
            <h3>Commands</h3>
            {this.renderListItemContent(
              null,
              this.renderCommands(currentContainer.detail.command)
            )}
          </div>

          <div className={styles.contentSection}>
            <h3>Resource</h3>
            {this.renderResource(currentContainer.resource)}
          </div>
        </Drawer>
        <div className={styles.drawerBottom}>
          {!!pod && this.renderAction(pod)}
        </div>
      </Drawer>
    );
  }
}

export default PodDrawer;
