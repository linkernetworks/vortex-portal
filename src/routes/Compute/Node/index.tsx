import * as React from 'react';
import * as NodeModel from '@/models/Node';
import { connect } from 'react-redux';
import { Row, Col, Tag, Drawer } from 'antd';
import { FormattedMessage } from 'react-intl';
import { dataPathType } from '@/models/Network';

import { Dispatch } from 'redux';
import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { clusterActions, clusterOperations } from '@/store/ducks/cluster';

import * as styles from './styles.module.scss';
import { Card } from 'antd';

interface NodeState {
  visible: boolean;
}

interface NodeProps {
  nodes: NodeModel.Node;
  fetchNodes: () => any;
}

class Node extends React.Component<NodeProps, NodeState> {
  constructor(props: NodeProps) {
    super(props);
    this.state = {
      visible: false
    };
  }

  public componentDidMount() {
    this.props.fetchNodes();
  }

  protected showMore = () => {
    this.setState({ visible: true });
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

  protected renderDetail = (key: string) => {
    const time = new Date(this.props.nodes[key].detail.createAt);
    return (
      <div>
        {this.renderListItemContent(
          <FormattedMessage id={`node.detail.createdAt`} />,
          time.toISOString()
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`node.detail.status`} />,
          this.props.nodes[key].detail.status
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`node.detail.os`} />,
          this.props.nodes[key].detail.os
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`node.detail.kernelVersion`} />,
          this.props.nodes[key].detail.kernelVersion
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`node.detail.kubeproxyVersion`} />,
          this.props.nodes[key].detail.kubeproxyVersion
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`node.detail.kubernetesVersion`} />,
          this.props.nodes[key].detail.kubernetesVersion
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`node.detail.labels`} />,
          this.renderLabels(this.props.nodes[key].detail.labels)
        )}
      </div>
    );
  };

  protected renderResource = (key: string) => {
    return (
      <div>
        <Row>
          <Col span={12}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.cpuRequests`} />,
              this.props.nodes[key].resource.cpuRequests
            )}
          </Col>
          <Col span={12}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.cpuLimits`} />,
              this.props.nodes[key].resource.cpuLimits
            )}
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.memoryRequests`} />,
              this.props.nodes[key].resource.memoryRequests
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.memoryLimits`} />,
              this.props.nodes[key].resource.memoryLimits
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.allocatableCPU`} />,
              this.props.nodes[key].resource.allocatableCPU
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.allocatableMemory`} />,
              this.props.nodes[key].resource.allocatableMemory
            )}
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.allocatablePods`} />,
              this.props.nodes[key].resource.allocatablePods
            )}
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.capacityCPU`} />,
              this.props.nodes[key].resource.capacityCPU
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.capacityPods`} />,
              this.props.nodes[key].resource.capacityPods
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`node.resource.capacityMemory`} />,
              this.props.nodes[key].resource.capacityMemory
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage
                id={`node.resource.capacityEphemeralStorage`}
              />,
              this.props.nodes[key].resource.capacityEphemeralStorage
            )}
          </Col>
        </Row>
      </div>
    );
  };

  protected renderInterface = (key: string) => {
    return (
      <div>
        {Object.keys(this.props.nodes[key].nics).map(name => {
          return (
            <div key={name}>
              <Col span={6}>
                {this.renderListItemContent(
                  <FormattedMessage id={`node.nics.name`} />,
                  name
                )}
              </Col>
              <Col span={6}>
                {this.renderListItemContent(
                  <FormattedMessage id={`node.nics.type`} />,
                  this.props.nodes[key].nics[name].type
                )}
              </Col>
              <Col span={6}>
                {this.renderListItemContent(
                  <FormattedMessage id={`node.nics.ip`} />,
                  this.props.nodes[key].nics[name].ip
                )}
              </Col>
              <Col span={6}>
                {this.renderListItemContent(
                  <FormattedMessage id={`node.nics.pciID`} />,
                  this.props.nodes[key].nics[name].pciID
                )}
              </Col>
            </div>
          );
        })}
      </div>
    );
  };

  protected renderCardItem = (key: string) => {
    return (
      <Card
        title={this.props.nodes[key].detail.hostname}
        extra={
          <a onClick={this.showMore} href="#">
            More
          </a>
        }
      >
        {this.renderDetail(key)}

        <Drawer
          title={this.props.nodes[key].detail.hostname}
          width={720}
          placement="right"
          closable={false}
          onClose={this.hideMore}
          visible={this.state.visible}
        >
          <h2>Resources</h2>
          {this.renderResource(key)}

          <h2>Interfaces</h2>
          {this.renderInterface(key)}
        </Drawer>
      </Card>
    );
  };

  public render() {
    return (
      <div>
        <Row>
          {Object.keys(this.props.nodes).map(key => {
            return (
              <Col key={key} span={12}>
                {this.renderCardItem(key)}
              </Col>
            );
          })}
        </Row>
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
      }
    });
  });

  return {
    nodes: state.cluster.nodes
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => ({
  fetchNodes: () => dispatch(clusterOperations.fetchNodes())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Node);
