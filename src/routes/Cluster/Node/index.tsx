import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Tag, Drawer, Tabs, Card, Table, Icon } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

import { Dispatch } from 'redux';
import * as NodeModel from '@/models/Node';
import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';

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

import { formatBytes } from '@/utils/bytes';

interface NodeState {
  visible: boolean;
  currentNode: string;
}

type NodeProps = OwnProps & InjectedAuthRouterProps;

interface OwnProps {
  nodes: NodeModel.Nodes;
  allNodes: Array<string>;
  nodesNics: NodeModel.NodesNics;
  fetchNodes: () => any;
}

interface NodeInfo {
  name: string;
  status: string;
  cpuRequests: string;
  cpiLimits: string;
  memoryRequests: string;
  memoryLimits: string;
  age: string;
}

const TabPane = Tabs.TabPane;

class Node extends React.Component<NodeProps, NodeState> {
  private intervalId: number;
  constructor(props: NodeProps) {
    super(props);
    this.state = {
      visible: false,
      currentNode: ''
    };
  }

  public componentDidMount() {
    this.props.fetchNodes();
    this.intervalId = window.setInterval(this.props.fetchNodes, 5000);
  }

  public componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  protected showMore = (node: string) => {
    this.setState({ visible: true, currentNode: node });
  };

  protected hideMore = () => {
    this.setState({ visible: false });
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

  protected renderStatusIcon = (status: string) => {
    switch (status) {
      case 'Ready':
        return <Icon type="check-circle" className={styles.readyIcon} />;
      default:
        return <Icon type="close-circle" className={styles.errorIcon} />;
    }
  };

  protected renderDetail = (node: string) => {
    const time = new Date(this.props.nodes[node].detail.createAt * 1000);
    return (
      <div>
        <Row>
          <Col span={12}>
            {this.renderListItemContent(
              <FormattedMessage id="node.detail.createdAt" />,
              time.toISOString()
            )}
          </Col>
          <Col span={12}>
            {this.renderListItemContent(
              <FormattedMessage id="node.detail.kernelVersion" />,
              this.props.nodes[node].detail.kernelVersion
            )}
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            {this.renderListItemContent(
              <FormattedMessage id="node.detail.status" />,
              this.props.nodes[node].detail.status
            )}
          </Col>
          <Col span={12}>
            {this.renderListItemContent(
              <FormattedMessage id="node.detail.dockerVersion" />,
              this.props.nodes[node].detail.dockerVersion
            )}
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            {this.renderListItemContent(
              <FormattedMessage id="node.detail.os" />,
              this.props.nodes[node].detail.os
            )}
          </Col>
          <Col span={12}>
            {this.renderListItemContent(
              <FormattedMessage id="node.detail.kubernetesVersion" />,
              this.props.nodes[node].detail.kubernetesVersion
            )}
          </Col>
        </Row>
      </div>
    );
  };

  protected renderResource = (node: string) => {
    return (
      <div>
        <Row>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="node.resource.capacityCPU" />,
              this.props.nodes[node].resource.capacityCPU
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="node.resource.capacityMemory" />,
              formatBytes(this.props.nodes[node].resource.capacityMemory)
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="node.resource.capacityPods" />,
              this.props.nodes[node].resource.capacityPods
            )}
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="node.resource.allocatableCPU" />,
              this.props.nodes[node].resource.allocatableCPU
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="node.resource.allocatableMemory" />,
              formatBytes(this.props.nodes[node].resource.allocatableMemory)
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="node.resource.allocatablePods" />,
              this.props.nodes[node].resource.allocatablePods
            )}
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="node.resource.cpuRequests" />,
              this.props.nodes[node].resource.cpuRequests
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="node.resource.memoryRequests" />,
              formatBytes(this.props.nodes[node].resource.memoryRequests)
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="node.resource.memoryHugepages" />,
              this.props.nodes[node].resource.memoryFreeHugepages +
                ' / ' +
                this.props.nodes[node].resource.memoryTotalHugepages
            )}
            {}
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="node.resource.cpuLimits" />,
              this.props.nodes[node].resource.cpuLimits
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="node.resource.memoryLimits" />,
              formatBytes(this.props.nodes[node].resource.memoryLimits)
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id="node.resource.memoryHugepagesSize" />,
              formatBytes(this.props.nodes[node].resource.memoryHugepagesSize)
            )}
          </Col>
        </Row>
      </div>
    );
  };

  protected renderChart(
    data1: Array<{ timestamp: number; value: string }>,
    data2: Array<{ timestamp: number; value: string }>,
    toMB: boolean
  ) {
    if (data1 === null) {
      data1 = [];
    }
    if (data2 === null) {
      data2 = [];
    }
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

  protected renderInterface = (node: string) => {
    let defaultKey = '';
    for (const name of Object.keys(this.props.nodes[node].nics)) {
      if (this.props.nodes[node].nics[name].default) {
        defaultKey = name;
        break;
      }
    }
    return (
      <Tabs defaultActiveKey={defaultKey}>
        {Object.keys(this.props.nodes[node].nics).map(name => {
          return (
            <TabPane tab={name} key={name}>
              <Col span={8}>
                {this.renderListItemContent(
                  <FormattedMessage id="node.nics.type" />,
                  this.props.nodes[node].nics[name].type
                )}
              </Col>
              <Col span={8}>
                {this.renderListItemContent(
                  <FormattedMessage id="node.nics.ip" />,
                  this.props.nodes[node].nics[name].ip
                )}
              </Col>
              <Col span={8}>
                {this.renderListItemContent(
                  <FormattedMessage id="node.nics.pciID" />,
                  this.props.nodes[node].nics[name].pciID
                )}
              </Col>
              <div>
                {this.renderListItemContent(
                  <FormattedMessage id="node.nics.TXRXMegabyteTotal" />,
                  <div>
                    {this.renderChart(
                      this.props.nodesNics[node][name].nicNetworkTraffic
                        .receiveBytesTotal,
                      this.props.nodesNics[node][name].nicNetworkTraffic
                        .transmitBytesTotal,
                      true
                    )}
                  </div>
                )}
              </div>
              <div>
                {this.renderListItemContent(
                  <FormattedMessage id="node.nics.TXRXPacketsTotal" />,
                  <div>
                    {this.renderChart(
                      this.props.nodesNics[node][name].nicNetworkTraffic
                        .receivePacketsTotal,
                      this.props.nodesNics[node][name].nicNetworkTraffic
                        .transmitPacketsTotal,
                      false
                    )}
                  </div>
                )}
              </div>
            </TabPane>
          );
        })}
      </Tabs>
    );
  };

  protected calculatePercent = (numerator: number, denominator: number) => {
    return `${numerator.toString()} (${((numerator / denominator) * 100)
      .toFixed(2)
      .toString()}%)`;
  };

  protected calculatePercentByte = (numerator: number, denominator: number) => {
    return `${formatBytes(numerator)} (${((numerator / denominator) * 100)
      .toFixed(2)
      .toString()}%)`;
  };

  protected getNodeInfo = (nodes: Array<string>) => {
    return nodes.map(node => ({
      name: this.props.nodes[node].detail.hostname,
      status: this.props.nodes[node].detail.status,
      cpuRequests: this.calculatePercent(
        this.props.nodes[node].resource.cpuRequests,
        this.props.nodes[node].resource.capacityCPU
      ),
      cpiLimits: this.calculatePercent(
        this.props.nodes[node].resource.cpuLimits,
        this.props.nodes[node].resource.capacityCPU
      ),
      memoryRequests: this.calculatePercentByte(
        this.props.nodes[node].resource.memoryRequests,
        this.props.nodes[node].resource.capacityMemory
      ),
      memoryLimits: this.calculatePercentByte(
        this.props.nodes[node].resource.memoryLimits,
        this.props.nodes[node].resource.capacityMemory
      ),
      age: moment(this.props.nodes[node].detail.createAt * 1000).fromNow()
    }));
  };

  public render() {
    const { currentNode } = this.state;
    const columns: Array<ColumnProps<NodeInfo>> = [
      {
        title: <FormattedMessage id="node.detail.name" />,
        dataIndex: 'name'
      },
      {
        title: <FormattedMessage id="node.detail.status" />,
        dataIndex: 'status'
      },
      {
        title: <FormattedMessage id="node.resource.cpuRequests" />,
        dataIndex: 'cpuRequests'
      },
      {
        title: <FormattedMessage id="node.resource.cpuLimits" />,
        dataIndex: 'cpiLimits'
      },
      {
        title: <FormattedMessage id="node.resource.memoryRequests" />,
        dataIndex: 'memoryRequests'
      },
      {
        title: <FormattedMessage id="node.resource.memoryLimits" />,
        dataIndex: 'memoryLimits'
      },
      {
        title: <FormattedMessage id="node.detail.age" />,
        dataIndex: 'age'
      },
      {
        title: 'Action',
        render: (_, record) => (
          <a onClick={() => this.showMore(record.name)}>More</a>
        )
      }
    ];
    return (
      <div>
        <Card title="Node">
          <Table
            className={styles.table}
            columns={columns}
            dataSource={this.getNodeInfo(this.props.allNodes)}
            size="small"
          />
          {this.props.nodes.hasOwnProperty(currentNode) && (
            <Drawer
              title="Node"
              width={720}
              placement="right"
              closable={false}
              onClose={this.hideMore}
              visible={this.state.visible}
            >
              <div className={styles.contentSection}>
                <h2 style={{ display: 'inline' }}>
                  {this.props.nodes[currentNode].detail.hostname}
                </h2>
                {this.renderStatusIcon(
                  this.props.nodes[currentNode].detail.status
                )}
              </div>

              <div className={styles.contentSection}>
                <h3>Details</h3>
                {this.renderDetail(currentNode)}
              </div>

              <div className={styles.contentSection}>
                <h3>Labels</h3>
                {this.renderListItemContent(
                  <FormattedMessage id="node.detail.labels" />,
                  this.renderLabels(this.props.nodes[currentNode].detail.labels)
                )}
              </div>

              <div className={styles.contentSection}>
                <h3>Resources</h3>
                {this.renderResource(currentNode)}
              </div>

              <div className={styles.contentSection}>
                <h3>Interfaces</h3>
                {this.renderInterface(currentNode)}
              </div>
            </Drawer>
          )}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    nodes: state.cluster.nodes,
    allNodes: state.cluster.allNodes,
    nodesNics: state.cluster.nodesNics
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => ({
  fetchNodes: () => dispatch(clusterOperations.fetchNodes())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Node);
