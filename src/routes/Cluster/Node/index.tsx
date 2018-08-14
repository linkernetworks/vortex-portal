import * as React from 'react';
import * as NodeModel from '@/models/Node';
import { connect } from 'react-redux';
import { Row, Col, Tag, Drawer, Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';

import { Dispatch } from 'redux';
import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';

import * as styles from './styles.module.scss';
import { Card } from 'antd';
import { TimelineChart } from 'ant-design-pro/lib/Charts';

import { formatBytes } from '@/utils/bytes';

const TabPane = Tabs.TabPane;

interface NodeState {
  visible: boolean;
  currentNode: string;
}

interface NodeProps {
  nodes: NodeModel.Nodes;
  allNodes: Array<string>;
  fetchNodes: () => any;
}

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

  protected renderDetail = (node: string) => {
    const time = new Date(this.props.nodes[node].detail.createAt * 1000);
    return (
      <div>
        {this.renderListItemContent(
          <FormattedMessage id={`node.detail.createdAt`} />,
          time.toISOString()
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`node.detail.status`} />,
          this.props.nodes[node].detail.status
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`node.detail.os`} />,
          this.props.nodes[node].detail.os
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`node.detail.kernelVersion`} />,
          this.props.nodes[node].detail.kernelVersion
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`node.detail.kubeproxyVersion`} />,
          this.props.nodes[node].detail.kubeproxyVersion
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`node.detail.kubernetesVersion`} />,
          this.props.nodes[node].detail.kubernetesVersion
        )}
      </div>
    );
  };

  protected renderResource = (node: string) => {
    return (
      <div>
        <Row>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.capacityCPU`} />,
              this.props.nodes[node].resource.capacityCPU
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.capacityMemory`} />,
              formatBytes(this.props.nodes[node].resource.capacityMemory)
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.capacityPods`} />,
              this.props.nodes[node].resource.capacityPods
            )}
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.allocatableCPU`} />,
              this.props.nodes[node].resource.allocatableCPU
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.allocatableMemory`} />,
              formatBytes(this.props.nodes[node].resource.allocatableMemory)
            )}
          </Col>
          <Col span={8}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.allocatablePods`} />,
              this.props.nodes[node].resource.allocatablePods
            )}
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.cpuRequests`} />,
              this.props.nodes[node].resource.cpuRequests
            )}
          </Col>
          <Col span={12}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.memoryRequests`} />,
              formatBytes(this.props.nodes[node].resource.memoryRequests)
            )}
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.cpuLimits`} />,
              this.props.nodes[node].resource.cpuLimits
            )}
          </Col>
          <Col span={12}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.memoryLimits`} />,
              formatBytes(this.props.nodes[node].resource.memoryLimits)
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
    const chartData: Array<{ x: any; y1: string; y2: string }> = [];
    data1.map((d, i) => {
      chartData.push({
        x: new Date(d.timestamp * 1000).getTime(),
        y1: data1[i].value,
        y2: data2[i].value
      });
    });
    return (
      <TimelineChart
        height={400}
        data={chartData}
        titleMap={{ y1: 'Receive Usage', y2: 'Transmit Usage' }}
      />
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
                  <FormattedMessage id={`node.nics.type`} />,
                  this.props.nodes[node].nics[name].type
                )}
              </Col>
              <Col span={8}>
                {this.renderListItemContent(
                  <FormattedMessage id={`node.nics.ip`} />,
                  this.props.nodes[node].nics[name].ip
                )}
              </Col>
              <Col span={8}>
                {this.renderListItemContent(
                  <FormattedMessage id={`node.nics.pciID`} />,
                  this.props.nodes[node].nics[name].pciID
                )}
              </Col>
              <div>
                {this.renderListItemContent(
                  <FormattedMessage id={`node.nics.TXRXBytesTotal`} />,
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
                  <FormattedMessage id={`node.nics.TXRXPacketsTotal`} />,
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

  protected renderCardItem = (node: string) => {
    return (
      <Card
        title={this.props.nodes[node].detail.hostname}
        extra={<a onClick={() => this.showMore(node)}>More</a>}
      >
        {this.renderDetail(node)}
      </Card>
    );
  };

  public render() {
    const { currentNode } = this.state;
    return (
      <div>
        <Row>
          {this.props.allNodes.map(node => {
            return (
              <Col key={node} span={12}>
                {this.renderCardItem(node)}
              </Col>
            );
          })}
        </Row>
        {this.props.nodes.hasOwnProperty(currentNode) && (
          <Drawer
            title={this.props.nodes[currentNode].detail.hostname}
            width={720}
            placement="right"
            closable={false}
            onClose={this.hideMore}
            visible={this.state.visible}
          >
            <h2>Labels</h2>
            {this.renderListItemContent(
              <FormattedMessage id={`node.detail.labels`} />,
              this.renderLabels(this.props.nodes[currentNode].detail.labels)
            )}

            <h2>Resources</h2>
            {this.renderResource(currentNode)}

            <h2>Interfaces</h2>
            {this.renderInterface(currentNode)}
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
      if (state.cluster.nodes[key].nics[name].type === 'virtual') {
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
