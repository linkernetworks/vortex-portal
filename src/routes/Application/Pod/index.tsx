import * as React from 'react';
import * as PodModel from '@/models/Pod';
import * as ContainerModel from '@/models/Container';
import * as NetworkModel from '@/models/Network';
import * as NamespaceModel from '@/models/Namespace';
import { findIndex, last } from 'lodash';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Tag,
  Drawer,
  Button,
  Icon,
  Tabs,
  Input,
  Select,
  Table,
  notification,
  Popconfirm
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { filter, includes } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

import { RootState, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';

import * as containerAPI from '@/services/container';
import * as networkAPI from '@/services/network';
import * as namespaceAPI from '@/services/namespace';

import * as styles from './styles.module.scss';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

// import PodForm from '@/components/PodForm';

const InputGroup = Input.Group;
const Search = Input.Search;
const Option = Select.Option;

interface PodState {
  visiblePodDrawer: boolean;
  visibleContainerDrawer: boolean;
  visibleModal: boolean;
  currentPod: string;
  currentContainer: ContainerModel.Container;
  containers: Array<ContainerModel.Container>;
  networks: Array<NetworkModel.Network>;
  namespaces: Array<NamespaceModel.Namespace>;
  searchType: string;
  searchText: string;
  deletable: boolean;
}

type PodProps = OwnProps & InjectedAuthRouterProps;
interface OwnProps {
  pods: PodModel.Pods;
  allPods: Array<string>;
  podsNics: PodModel.PodsNics;
  fetchPods: () => any;
  fetchPodsFromMongo: () => any;
  addPod: (data: PodModel.PodRequest) => any;
  removePod: (id: string) => any;
}

interface PodInfo {
  name: string;
  status: string;
  node: string;
  restarts: number;
  age: string;
}

const TabPane = Tabs.TabPane;

class Pod extends React.Component<PodProps, PodState> {
  private intervalPodId: number;
  private intervalContainersId: Array<number> = [];
  constructor(props: PodProps) {
    super(props);
    this.state = {
      visiblePodDrawer: false,
      visibleContainerDrawer: false,
      visibleModal: false,
      currentPod: '',
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
      networks: [],
      namespaces: [],
      searchType: 'pod',
      searchText: '',
      deletable: true
    };
  }

  public componentDidMount() {
    this.props.fetchPods();
    this.intervalPodId = window.setInterval(this.props.fetchPods, 5000);
    this.props.fetchPodsFromMongo();
  }

  public componentWillUnmount() {
    clearInterval(this.intervalPodId);
  }

  protected showCreate = () => {
    networkAPI.getNetworks().then(res => {
      this.setState({ networks: res.data });
    });
    namespaceAPI.getNamespaces().then(res => {
      this.setState({ namespaces: res.data });
    });
    this.setState({ visibleModal: true });
  };

  protected hideCreate = () => {
    this.setState({ visibleModal: false });
  };

  protected handleSubmit = (podRequest: PodModel.PodRequest) => {
    this.props.addPod(podRequest);
    this.setState({ visibleModal: false });
  };

  protected handleChangeSearchType = (type: string) => {
    this.setState({ searchType: type, searchText: '' });
  };

  protected handleSearch = (e: any) => {
    this.setState({ searchText: e.target.value });
  };

  protected handleRemovePod = (id: string) => {
    this.setState({ deletable: false });
    this.props.removePod(id);
    return notification.success({
      message: 'Success',
      description: 'Delete the pod successfully.'
    });
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
            }
          });
        }
      } else {
        containers.push(newContainer);
      }
    });
    this.setState({ containers });
  };

  protected showMorePod = (pod: string) => {
    this.props.pods[pod].containers.map(container => {
      // Only show in pod's container drawer so get container data without flow
      const containers: Array<ContainerModel.Container> = [];
      containerAPI.getContainer(pod, container).then(res => {
        containers.push(res.data);
        this.setState({ containers });
      });
      const id = window.setInterval(() => this.fetchContainer(pod, container), 5000);
      this.intervalContainersId.push(id);
    });
    this.setState({ visiblePodDrawer: true, currentPod: pod });
  };

  protected showMoreContainer = (container: ContainerModel.Container) => {
    this.setState({
      visibleContainerDrawer: true,
      currentContainer: container
    });
  };

  protected hideMorePod = () => {
    this.intervalContainersId.map(id => {
      clearInterval(id);
    });
    this.setState({ visiblePodDrawer: false, containers: [] });
  };

  protected hideMoreContainer = () => {
    this.setState({ visibleContainerDrawer: false });
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
        title: 'Action',
        key: 'action',
        render: (text: string, record: ContainerModel.Container) => (
          <a onClick={() => this.showMoreContainer(record)}>More</a>
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
              <FormattedMessage id={`container.detail.status`} />,
              container.status
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.detail.namespace`} />,
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
              <FormattedMessage id={`container.detail.createAt`} />,
              moment(container.createAt * 1000).calendar()
            )}
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.detail.node`} />,
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

  protected renderResource = (container: ContainerModel.Resource) => {
    return (
      <div>
        <Row>
          <Col span={24}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.resource.cpuUsagePercentage`} />,
              <div>
                {this.renderContainerChart(container.cpuUsagePercentage, false)}
              </div>
            )}
          </Col>
          <Col span={24}>
            {this.renderListItemContent(
              <FormattedMessage
                id={`container.resource.memoryUsageMegabyte`}
              />,
              <div>
                {this.renderContainerChart(container.memoryUsageBytes, true)}
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
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
          type="monotone"
          name="Receive Usage"
          dataKey="y1"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          name="Transmit Usage"
          dataKey="y2"
          stroke="#82ca9d"
        />
      </LineChart>
    );
  }

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
    let defaultKey = '';
    for (const name of Object.keys(nics)) {
      if (nics[name].default) {
        defaultKey = name;
        break;
      }
    }
    return (
      <Tabs defaultActiveKey={defaultKey}>
        {Object.keys(nics).map(name => (
          <TabPane tab={name} key={name}>
            <div>{name}</div>
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

  protected renderAction = (podMetaData: PodModel.PodFromMongo) => {
    if (podMetaData !== undefined && this.state.deletable === true) {
      return (
        <Popconfirm
          key="action.delete"
          title={<FormattedMessage id="action.confirmToDelete" />}
          onConfirm={this.handleRemovePod.bind(this, podMetaData.id)}
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

  protected renderDetail = (pod: string) => {
    return (
      <div>
        <Row>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="pod.status" />,
              this.props.pods[pod].status
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="pod.createAt" />,
              moment(this.props.pods[pod].createAt * 1000).calendar()
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="pod.ip" />,
              this.props.pods[pod].ip
            )}
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="pod.namespace" />,
              this.props.pods[pod].namespace
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="pod.createByName" />,
              this.props.pods[pod].createByName
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="pod.restartCount" />,
              this.props.pods[pod].restartCount
            )}
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="pod.node" />,
              this.props.pods[pod].node
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="pod.createByKind" />,
              this.props.pods[pod].createByKind
            )}
          </Col>
        </Row>
      </div>
    );
  };

  protected getPodInfo = (pods: Array<string>) => {
    return pods.map(pod => ({
      name: this.props.pods[pod].podName,
      namespace: this.props.pods[pod].namespace,
      node: this.props.pods[pod].node,
      status: this.props.pods[pod].status,
      restarts: this.props.pods[pod].restartCount,
      age: moment(this.props.pods[pod].createAt * 1000).fromNow()
    }));
  };

  public render() {
    const { currentPod, currentContainer, searchText } = this.state;
    const filterPods = filter(this.props.allPods, name => {
      switch (this.state.searchType) {
        default:
        case 'pod':
          return includes(this.props.pods[name].podName, searchText);
        case 'container':
          for (const container of this.props.pods[name].containers) {
            if (includes(container, searchText)) {
              return true;
            }
          }
          return false;
        case 'node':
          return includes(this.props.pods[name].node, searchText);
        case 'namespace':
          return includes(this.props.pods[name].namespace, searchText);
      }
    });
    const columns: Array<ColumnProps<PodInfo>> = [
      {
        title: <FormattedMessage id="pod.name" />,
        dataIndex: 'name',
        width: 300
      },
      {
        title: <FormattedMessage id="pod.namespace" />,
        dataIndex: 'namespace'
      },
      {
        title: <FormattedMessage id="pod.node" />,
        dataIndex: 'node'
      },
      {
        title: <FormattedMessage id="pod.status" />,
        dataIndex: 'status'
      },
      {
        title: <FormattedMessage id="pod.age" />,
        dataIndex: 'age'
      },
      {
        title: 'Action',
        render: (_, record) => (
          <a onClick={() => this.showMorePod(record.name)}>More</a>
        )
      }
    ];
    return (
      <div>
        <InputGroup compact={true}>
          <Select
            style={{ width: '15%' }}
            defaultValue="Pod Name"
            onChange={this.handleChangeSearchType}
          >
            <Option value="pod">Pod Name</Option>
            <Option value="container">Container Name</Option>
            <Option value="node">Node Name</Option>
            <Option value="namespace">Namespace</Option>
          </Select>
          <Search
            style={{ width: '20%' }}
            placeholder="Input search text"
            value={this.state.searchText}
            onChange={this.handleSearch}
          />
        </InputGroup>
        <br />
        <Table
          className={styles.table}
          columns={columns}
          dataSource={this.getPodInfo(filterPods)}
          size="middle"
        />
        {this.props.pods.hasOwnProperty(currentPod) && (
          <Drawer
            title="Pod"
            width={720}
            closable={false}
            onClose={this.hideMorePod}
            visible={this.state.visiblePodDrawer}
          >
            <div className={styles.contentSection}>
              <h2 style={{ display: 'inline' }}>
                {this.props.pods[currentPod].podName}
              </h2>
              {this.renderStatusIcon(this.props.pods[currentPod].status)}
            </div>

            <div className={styles.contentSection}>
              <h3>Details</h3>
              {this.renderDetail(currentPod)}
            </div>

            <div className={styles.contentSection}>
              <h3>Labels</h3>
              {this.renderListItemContent(
                <FormattedMessage id="pod.labels" />,
                this.renderLabels(this.props.pods[currentPod].labels)
              )}
            </div>

            <div className={styles.contentSection}>
              <h3>Containers</h3>
              {this.renderContainer()}
            </div>

            <h3>Interface</h3>
            {this.renderInterface(this.props.podsNics[currentPod])}

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
              {this.renderAction(this.props.pods[currentPod].metadata)}
            </div>
          </Drawer>
        )}

        {/* <Button type="dashed" className={styles.add} onClick={this.showCreate}>
          <Icon type="plus" /> <FormattedMessage id="pod.add" />
        </Button>
        <PodForm
          allPods={this.props.allPods}
          pods={this.props.pods}
          networks={this.state.networks}
          namespaces={this.state.namespaces}
          visible={this.state.visibleModal}
          onCancel={this.hideCreate}
          onSubmit={this.handleSubmit}
        /> */}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  state.cluster.podsFromMongo.forEach(pod => {
    if (state.cluster.pods[pod.name] !== undefined) {
      state.cluster.pods[pod.name].metadata = pod;
    }
  });
  return {
    pods: state.cluster.pods,
    allPods: state.cluster.allPods,
    podsNics: state.cluster.podsNics
  };
};

const mapDispatchToProps = (dispatch: RTDispatch) => ({
  fetchPods: () => dispatch(clusterOperations.fetchPods()),
  fetchPodsFromMongo: () => dispatch(clusterOperations.fetchPodsFromMongo()),
  addPod: (data: PodModel.PodRequest) => {
    dispatch(clusterOperations.addPod(data));
  },
  removePod: (id: string) => dispatch(clusterOperations.removePod(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pod);
