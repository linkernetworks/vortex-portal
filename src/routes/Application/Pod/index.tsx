import * as React from 'react';
import * as PodModel from '@/models/Pod';
import * as ContainerModel from '@/models/Container';
import * as NetworkModel from '@/models/Network';
import * as NamespaceModel from '@/models/Namespace';
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
  Card,
  Table
} from 'antd';
import * as moment from 'moment';
import { filter, includes } from 'lodash';
import { FormattedMessage } from 'react-intl';

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

import PodForm from '@/components/PodForm';

const TabPane = Tabs.TabPane;
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
}

interface PodProps {
  pods: PodModel.Pods;
  allPods: Array<string>;
  fetchPods: () => any;
  addPod: (data: PodModel.PodRequest) => any;
}

class Pod extends React.Component<PodProps, PodState> {
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
          pod: '',
          namespace: '',
          node: '',
          image: '',
          command: []
        },
        status: {
          status: '',
          waitingReason: '',
          terminatedReason: '',
          restartTime: ''
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
      searchText: ''
    };
  }

  public componentDidMount() {
    this.props.fetchPods();
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

  protected showMorePod = (pod: string) => {
    const containers: Array<ContainerModel.Container> = [];
    this.props.pods[pod].containers.map(container => {
      containerAPI.getContainer(container).then(res => {
        containers.push(res.data);
        this.setState({ containers });
      });
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
    this.setState({ visiblePodDrawer: false });
  };

  protected hideMoreContainer = () => {
    this.setState({ visibleContainerDrawer: false });
  };

  protected renderLabels = (labels: Map<string, string>) => {
    return (
      <div className={styles.labels}>
        {Object.keys(labels).map(key => (
          <Tag className={styles.label} key={key}>
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
        dataIndex: 'status.status',
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
      <Row>
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
            <FormattedMessage id={`container.detail.node`} />,
            container.node
          )}
        </Col>
        <Col span={6}>
          {this.renderListItemContent(
            <FormattedMessage id={`container.detail.createAt`} />,
            moment(container.createAt * 1000).calendar()
          )}
        </Col>
      </Row>
    );
  };

  protected renderCommands = (command: Array<string>) => {
    return (
      <div className={styles.commands}>
        {command != null &&
          command.map(c => (
            <Tag className={styles.command} key={c}>
              {c}
            </Tag>
          ))}
      </div>
    );
  };

  protected renderStatus = (container: ContainerModel.Status) => {
    return (
      <div>
        <Row>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.status.status`} />,
              container.status
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.status.waitingReason`} />,
              container.waitingReason
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.status.terminatedReason`} />,
              container.terminatedReason
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.status.restartTime`} />,
              container.restartTime
            )}
          </Col>
        </Row>
      </div>
    );
  };

  protected renderResource = (container: ContainerModel.Resource) => {
    return (
      <div>
        <Row>
          <Col span={24}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.resource.cpuUsagePercentage`} />,
              <div>
                {this.renderContainerChart(container.cpuUsagePercentage)}
              </div>
            )}
          </Col>
          <Col span={24}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.resource.memoryUsageBytes`} />,
              <div>{this.renderContainerChart(container.memoryUsageBytes)}</div>
            )}
          </Col>
        </Row>
      </div>
    );
  };

  protected renderPodChart(
    data1: Array<{ timestamp: number; value: string }>,
    data2: Array<{ timestamp: number; value: string }>
  ) {
    const chartData: Array<{ x: string; y1: number; y2: number }> = [];
    data1.map((d, i) => {
      chartData.push({
        x: moment(d.timestamp * 1000).calendar(),
        y1: parseFloat(data1[i].value),
        y2: parseFloat(data2[i].value)
      });
    });
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
    data: Array<{ timestamp: number; value: string }>
  ) {
    const chartData: Array<{ x: string; y1: number }> = [];
    data.map(d => {
      chartData.push({
        x: moment(d.timestamp * 1000).calendar(),
        y1: parseFloat(d.value)
      });
    });
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
    return (
      <Tabs>
        {Object.keys(nics).map(name => {
          return (
            <TabPane tab={name} key={name}>
              <div>{name}</div>
              <Row>
                <Col span={24}>
                  {this.renderListItemContent(
                    <FormattedMessage
                      id={`pod.nicNetworkTraffic.TXRXBytesTotal`}
                    />,
                    <div>
                      {this.renderPodChart(
                        nics[name].nicNetworkTraffic.receiveBytesTotal,
                        nics[name].nicNetworkTraffic.transmitBytesTotal
                      )}
                    </div>
                  )}
                </Col>
                <Col span={24}>
                  {this.renderListItemContent(
                    <FormattedMessage
                      id={`pod.nicNetworkTraffic.TXRXPacketsTotal`}
                    />,
                    <div>
                      {this.renderPodChart(
                        nics[name].nicNetworkTraffic.receivePacketsTotal,
                        nics[name].nicNetworkTraffic.transmitPacketsTotal
                      )}
                    </div>
                  )}
                </Col>
              </Row>
            </TabPane>
          );
        })}
      </Tabs>
    );
  };

  protected renderDetail = (pod: string) => {
    return (
      <div>
        {this.renderListItemContent(
          <FormattedMessage id={`pod.status`} />,
          this.props.pods[pod].status
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`pod.namespace`} />,
          this.props.pods[pod].namespace
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`pod.ip`} />,
          this.props.pods[pod].ip
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`pod.node`} />,
          this.props.pods[pod].node
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`pod.createAt`} />,
          moment(this.props.pods[pod].createAt * 1000).calendar()
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`pod.createByName`} />,
          this.props.pods[pod].createByName
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`pod.createByKind`} />,
          this.props.pods[pod].createByKind
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`pod.restartCount`} />,
          this.props.pods[pod].restartCount
        )}
      </div>
    );
  };

  protected renderCardItem = (pod: string) => {
    return (
      <Card
        title={this.props.pods[pod].podName}
        extra={<a onClick={() => this.showMorePod(pod)}>More</a>}
      >
        {this.renderDetail(pod)}
      </Card>
    );
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
        <Row>
          {filterPods.map(pod => {
            return (
              <Col key={this.props.pods[pod].podName} span={6}>
                {this.renderCardItem(pod)}
              </Col>
            );
          })}
        </Row>
        {this.props.pods.hasOwnProperty(currentPod) && (
          <Drawer
            title={this.props.pods[currentPod].podName}
            width={720}
            closable={false}
            onClose={this.hideMorePod}
            visible={this.state.visiblePodDrawer}
          >
            <h2>Labels</h2>
            {this.renderListItemContent(
              <FormattedMessage id={`pod.labels`} />,
              this.renderLabels(this.props.pods[currentPod].labels)
            )}

            <h2>Containers</h2>
            {this.renderContainer()}

            <h2>Interface</h2>
            {this.renderInterface(this.props.pods[currentPod].nics)}

            <Drawer
              title={currentContainer.detail.containerName}
              width={720}
              closable={false}
              onClose={this.hideMoreContainer}
              visible={this.state.visibleContainerDrawer}
            >
              <h2>Detail</h2>
              {this.renderContainerDetail(currentContainer.detail)}

              <h2>Commands</h2>
              {this.renderListItemContent(
                <FormattedMessage id={`container.detail.command`} />,
                this.renderCommands(currentContainer.detail.command)
              )}

              <h2>Status</h2>
              {this.renderStatus(currentContainer.status)}

              <h2>Resource</h2>
              {this.renderResource(currentContainer.resource)}
            </Drawer>
          </Drawer>
        )}

        <Button type="dashed" className={styles.add} onClick={this.showCreate}>
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
        />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    pods: state.cluster.pods,
    allPods: state.cluster.allPods
  };
};

const mapDispatchToProps = (dispatch: RTDispatch) => ({
  fetchPods: () => dispatch(clusterOperations.fetchPods()),
  addPod: (data: PodModel.PodRequest) => {
    dispatch(clusterOperations.addPod(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pod);
