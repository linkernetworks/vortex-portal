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
}

interface PodProps {
  pods: Array<PodModel.Pod>;
  fetchPods: () => any;
}

class Pod extends React.Component<PodProps, PodState> {
  constructor(props: PodProps) {
    super(props);
    this.state = {
      visible: false
    };
  }

  public componentDidMount() {
    this.props.fetchPods();
  }

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

  protected renderDetail = (pod: PodModel.Pod) => {
    return (
      <div>
        {this.renderListItemContent(
          <FormattedMessage id={`pod.createdAt`} />,
          pod.createdAt
        )}
        <h4>Container</h4>
        {pod.containers.map(container => {
          return (
            <Row key={container.name}>
              <Col span={8}>
                {this.renderListItemContent(
                  <FormattedMessage id={`container.name`} />,
                  container.name
                )}
              </Col>
              <Col span={8}>
                {this.renderListItemContent(
                  <FormattedMessage id={`container.image`} />,
                  container.image
                )}
              </Col>
              <Col span={8}>
                {this.renderListItemContent(
                  <FormattedMessage id={`container.command`} />,
                  container.command
                )}
              </Col>
            </Row>
          );
        })}
      </div>
    );
  };

  protected renderCardItem = (pod: PodModel.Pod) => {
    return <Card title={pod.name}>{this.renderDetail(pod)}</Card>;
  };

  public render() {
    return (
      <div>
        <Row>
          {this.props.pods.map(pod => {
            return (
              <Col key={pod.id} span={6}>
                {this.renderCardItem(pod)}
              </Col>
            );
          })}
        </Row>
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
