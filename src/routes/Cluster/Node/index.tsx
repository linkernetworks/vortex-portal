import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Tag, Drawer, Tabs, Table } from 'antd';
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
  constructor(props: NodeProps) {
    super(props);
    this.state = {
      visible: false,
      currentNode: ''
    };
  }

  public componentDidMount() {
    this.props.fetchNodes();
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
              formatBytes(
                this.props.nodes[node].resource.memoryTotalHugepages
              ) +
                ' / ' +
                formatBytes(this.props.nodes[node].resource.memoryFreeHugepages)
            )}
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
              <FormattedMessage id="node.resource.memoryHugepageSize" />,
              formatBytes(this.props.nodes[node].resource.memoryHugepageSize)
            )}
          </Col>
        </Row>
      </div>
    );
  };

  protected renderChart(
    data1: Array<{ timestamp: number; value: string }>,
    data2: Array<{ timestamp: number; value: string }>
  ) {
    if (data1 === null) {
      data1 = [];
    }
    if (data2 === null) {
      data2 = [];
    }
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

  protected renderInterface = (node: string) => {
    return (
      <Tabs>
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
                  <FormattedMessage id="node.nics.TXRXBytesTotal" />,
                  <div>
                    {this.renderChart(
                      this.props.nodes[node].nics[name].nicNetworkTraffic
                        .receiveBytesTotal,
                      this.props.nodes[node].nics[name].nicNetworkTraffic
                        .transmitBytesTotal
                    )}
                  </div>
                )}
              </div>
              <div>
                {this.renderListItemContent(
                  <FormattedMessage id="node.nics.TXRXPacketsTotal" />,
                  <div>
                    {this.renderChart(
                      this.props.nodes[node].nics[name].nicNetworkTraffic
                        .receivePacketsTotal,
                      this.props.nodes[node].nics[name].nicNetworkTraffic
                        .transmitPacketsTotal
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
        <Table
          className={styles.table}
          columns={columns}
          dataSource={this.getNodeInfo(this.props.allNodes)}
          size="middle"
        />
        {this.props.nodes.hasOwnProperty(currentNode) && (
          <Drawer
            title={this.props.nodes[currentNode].detail.hostname}
            width={720}
            placement="right"
            closable={false}
            onClose={this.hideMore}
            visible={this.state.visible}
          >
            <div className={styles.nodeContentSection}>
              <h2>Details</h2>
              {this.renderDetail(currentNode)}
            </div>

            <div className={styles.nodeContentSection}>
              <h2>Labels</h2>
              {this.renderListItemContent(
                <FormattedMessage id="node.detail.labels" />,
                this.renderLabels(this.props.nodes[currentNode].detail.labels)
              )}
            </div>

            <div className={styles.nodeContentSection}>
              <h2>Resources</h2>
              {this.renderResource(currentNode)}
            </div>

            <div className={styles.nodeContentSection}>
              <h2>Interfaces</h2>
              {this.renderInterface(currentNode)}
            </div>
          </Drawer>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  // Remove virtual interface
  Object.keys(state.cluster.nodes).map(key => {
    Object.keys(state.cluster.nodes[key].nics).map(name => {
      if (state.cluster.nodes[key].nics[name].type !== 'physical') {
        delete state.cluster.nodes[key].nics[name];
      } else if (state.cluster.nodes[key].nics[name].dpdk === true) {
        delete state.cluster.nodes[key].nics[name];
      }
    });
  });

  return {
    nodes: state.cluster.nodes,
    allNodes: state.cluster.allNodes
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => ({
  fetchNodes: () => dispatch(clusterOperations.fetchNodes())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Node);
