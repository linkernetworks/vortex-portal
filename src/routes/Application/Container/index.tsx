import * as React from 'react';
import * as ContainerModel from '@/models/Container';
import { connect } from 'react-redux';
import { Row, Col, Tag, Drawer } from 'antd';
import { FormattedMessage } from 'react-intl';

import { Dispatch } from 'redux';
import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';

import * as styles from './styles.module.scss';
import { Card } from 'antd';
import { TimelineChart } from 'ant-design-pro/lib/Charts';

interface ContainerState {
  visibleDrawer: boolean;
  currentContainer: string;
}

interface ContainerProps {
  containers: ContainerModel.Containers;
  allContainers: Array<string>;
  fetchContainers: () => any;
}

class Container extends React.Component<ContainerProps, ContainerState> {
  constructor(props: ContainerProps) {
    super(props);
    this.state = {
      visibleDrawer: false,
      currentContainer: ''
    };
  }

  public componentDidMount() {
    this.props.fetchContainers();
  }

  protected showMore = (container: string) => {
    this.setState({ visibleDrawer: true, currentContainer: container });
  };

  protected hideMore = () => {
    this.setState({ visibleDrawer: false });
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

  protected renderChart(data: Array<{ timestamp: number; value: string }>) {
    const chartData: Array<{ x: any; y1: string; y2: string }> = [];
    data.map(d => {
      chartData.push({
        x: new Date(d.timestamp * 1000).getTime(),
        y1: d.value,
        y2: ''
      });
    });
    return (
      <TimelineChart
        height={300}
        data={chartData}
        titleMap={{ y1: 'Usage', y2: '' }}
      />
    );
  }

  protected renderResource = (container: string) => {
    return (
      <div>
        <Row>
          <Col span={24}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.resource.cpuUsagePercentage`} />,
              <div>
                {this.renderChart(
                  this.props.containers[container].resource.cpuUsagePercentage
                )}
              </div>
            )}
          </Col>
          <Col span={24}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.resource.memoryUsageBytes`} />,
              <div>
                {this.renderChart(
                  this.props.containers[container].resource.memoryUsageBytes
                )}
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  };

  protected renderStatus = (container: string) => {
    return <div />;
    return (
      <div>
        <Row>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.status.status`} />,
              this.props.containers[container].status.status
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.status.waitingReason`} />,
              this.props.containers[container].status.waitingReason
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.status.terminatedReason`} />,
              this.props.containers[container].status.terminatedReason
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.status.restartTime`} />,
              this.props.containers[container].status.restartTime
            )}
          </Col>
        </Row>
      </div>
    );
  };

  protected renderDetail = (container: string) => {
    return (
      <div>
        {this.renderListItemContent(
          <FormattedMessage id={`container.status.status`} />,
          this.props.containers[container].status.status
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`container.detail.namespace`} />,
          this.props.containers[container].detail.namespace
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`container.detail.image`} />,
          this.props.containers[container].detail.image
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`container.detail.pod`} />,
          this.props.containers[container].detail.pod
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`container.detail.node`} />,
          this.props.containers[container].detail.node
        )}
      </div>
    );
  };

  protected renderCardItem = (container: string) => {
    return (
      <Card
        title={this.props.containers[container].detail.containerName}
        extra={<a onClick={() => this.showMore(container)}>More</a>}
      >
        {this.renderDetail(container)}
      </Card>
    );
  };

  public render() {
    const { currentContainer } = this.state;
    return (
      <div>
        <Row>
          {this.props.allContainers.map(container => {
            return (
              <Col
                key={this.props.containers[container].detail.containerName}
                span={8}
              >
                {this.renderCardItem(container)}
              </Col>
            );
          })}
        </Row>
        {this.props.containers.hasOwnProperty(currentContainer) && (
          <Drawer
            title={this.props.containers[currentContainer].detail.containerName}
            width={720}
            placement="right"
            closable={false}
            onClose={this.hideMore}
            visible={this.state.visibleDrawer}
          >
            <h2>Commands</h2>
            {this.renderListItemContent(
              <FormattedMessage id={`container.detail.command`} />,
              this.renderCommands(
                this.props.containers[currentContainer].detail.command
              )
            )}

            <h2>Status</h2>
            {this.renderStatus(currentContainer)}

            <h2>Resource</h2>
            {this.renderResource(currentContainer)}
          </Drawer>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    containers: state.cluster.containers,
    allContainers: state.cluster.allContainers
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => ({
  fetchContainers: () => dispatch(clusterOperations.fetchContainers())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
