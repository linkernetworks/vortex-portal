import * as React from 'react';
import * as PodModel from '@/models/Pod';
import { connect } from 'react-redux';
import { Row, Col, Tag, Drawer } from 'antd';
import { FormattedMessage } from 'react-intl';
import { dataPathType } from '@/models/Network';

import { Dispatch } from 'redux';
import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { clusterActions, clusterOperations } from '@/store/ducks/cluster';

import * as styles from './styles.module.scss';
import { Card } from 'antd';

interface PodState {
  visible: boolean;
  currentKey: string;
}

interface PodProps {
  pods: PodModel.Pod;
  fetchPods: () => any;
}

class Pod extends React.Component<PodProps, PodState> {
  constructor(props: PodProps) {
    super(props);
    this.state = {
      visible: false,
      currentKey: ''
    };
  }

  public componentDidMount() {
    this.props.fetchPods();
  }

  protected showMore = (key: string) => {
    this.setState({ visible: true, currentKey: key });
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
    return (
      <div>
        {this.renderListItemContent(
          <FormattedMessage id={`pod.status`} />,
          this.props.pods[key].status
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`pod.namespace`} />,
          this.props.pods[key].namespace
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`pod.ip`} />,
          this.props.pods[key].ip
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`pod.node`} />,
          this.props.pods[key].node
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`pod.createAt`} />,
          this.props.pods[key].createAt
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`pod.createByName`} />,
          this.props.pods[key].createByName
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`pod.createByKind`} />,
          this.props.pods[key].createByKind
        )}
        {this.renderListItemContent(
          <FormattedMessage id={`pod.restartCount`} />,
          this.props.pods[key].restartCount
        )}
      </div>
    );
  };

  protected renderCardItem = (key: string) => {
    return (
      <Card
        title={this.props.pods[key].podName}
        extra={
          <a onClick={() => this.showMore(key)} href="#">
            More
          </a>
        }
      >
        {this.renderDetail(key)}
      </Card>
    );
  };

  public render() {
    const { currentKey } = this.state;
    return (
      <div>
        <Row>
          {Object.keys(this.props.pods).map(key => {
            return (
              <Col key={this.props.pods[key].podName} span={6}>
                {this.renderCardItem(key)}
              </Col>
            );
          })}
        </Row>
        {this.props.pods.hasOwnProperty(currentKey) && (
          <Drawer
            title={this.props.pods[currentKey].podName}
            width={720}
            placement="right"
            closable={false}
            onClose={this.hideMore}
            visible={this.state.visible}
          >
            <h2>Labels</h2>
            {this.renderListItemContent(
              <FormattedMessage id={`pod.labels`} />,
              this.renderLabels(this.props.pods[currentKey].labels)
            )}

            <h2>Containers</h2>
          </Drawer>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    pods: state.cluster.pods
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => ({
  fetchPods: () => dispatch(clusterOperations.fetchPods())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pod);
