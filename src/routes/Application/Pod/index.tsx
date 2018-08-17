import * as React from 'react';
import * as PodModel from '@/models/Pod';
import * as ContainerModel from '@/models/Container';
import * as NetworkModel from '@/models/Network';
import * as NamespaceModel from '@/models/Namespace';
import { connect } from 'react-redux';
import { Row, Col, Tag, Drawer, Button, Icon, Tabs, Input, Select } from 'antd';
import * as moment from 'moment';
import { filter, includes } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { RootState, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';

import * as containerAPI from '@/services/container';
import * as networkAPI from '@/services/network';
import * as namespaceAPI from '@/services/namespace';

import * as styles from './styles.module.scss';
import { Card } from 'antd';
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
  visibleDrawer: boolean;
  visibleModal: boolean;
  currentPod: string;
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
      visibleDrawer: false,
      visibleModal: false,
      currentPod: '',
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

  protected showMore = (pod: string) => {
    const containers: Array<ContainerModel.Container> = [];
    this.props.pods[pod].containers.map(container => {
      containerAPI.getContainer(container).then(res => {
        containers.push(res.data);
        this.setState({ containers });
      });
    });
    this.setState({ visibleDrawer: true, currentPod: pod });
  };

  protected hideMore = () => {
    this.setState({ visibleDrawer: false });
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
    return (
      <div>
        {this.state.containers.map(container => {
          return (
            <Row key={container.detail.containerName}>
              <Col span={6}>
                {this.renderListItemContent(
                  <FormattedMessage id={`container.detail.name`} />,
                  container.detail.containerName
                )}
              </Col>
              <Col span={6}>
                {this.renderListItemContent(
                  <FormattedMessage id={`container.status.status`} />,
                  container.status.status
                )}
              </Col>
              <Col span={6}>
                {this.renderListItemContent(
                  <FormattedMessage id={`container.detail.namespace`} />,
                  container.detail.namespace
                )}
              </Col>
              <Col span={6}>
                {this.renderListItemContent(
                  <FormattedMessage id={`container.detail.image`} />,
                  container.detail.image
                )}
              </Col>
            </Row>
          );
        })}
      </div>
    );
  };

  protected renderChart(
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
                      {this.renderChart(
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
                      {this.renderChart(
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
    const time = new Date(this.props.pods[pod].createAt * 1000);
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
          time.toISOString()
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
        extra={<a onClick={() => this.showMore(pod)}>More</a>}
      >
        {this.renderDetail(pod)}
      </Card>
    );
  };

  public render() {
    const { currentPod, searchText } = this.state;
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
            placement="right"
            closable={false}
            onClose={this.hideMore}
            visible={this.state.visibleDrawer}
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
