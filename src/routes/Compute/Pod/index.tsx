import * as React from 'react';
import * as PodModel from '@/models/Pod';
import * as ContainerModel from '@/models/Container';
import * as NetworkModel from '@/models/Network';
import { connect } from 'react-redux';
import { Row, Col, Tag, Drawer, Button, Icon, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

import { Dispatch } from 'redux';
import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { clusterActions, clusterOperations } from '@/store/ducks/cluster';

import * as containerAPI from '@/services/container';
import * as networkAPI from '@/services/network';

import * as styles from './styles.module.scss';
import { Card } from 'antd';

import PodForm from '@/components/PodForm';

interface PodState {
  visibleDrawer: boolean;
  visibleModal: boolean;
  currentPod: string;
  containers: Array<ContainerModel.Container>;
  networks: Array<NetworkModel.Network>;
}

interface PodProps {
  pods: PodModel.Pods;
  allPods: Array<string>;
  fetchPods: () => any;
}

class Pod extends React.Component<PodProps, PodState> {
  constructor(props: PodProps) {
    super(props);
    this.state = {
      visibleDrawer: false,
      visibleModal: false,
      currentPod: '',
      containers: [],
      networks: []
    };
  }

  public componentDidMount() {
    this.props.fetchPods();
  }

  protected showCreate = () => {
    networkAPI.getNetworks().then(res => {
      this.setState({ networks: res.data });
    });
    this.setState({ visibleModal: true });
  };

  protected hideCreate = () => {
    this.setState({ visibleModal: false });
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

  protected renderCreateModal = () => {
    return (
      <Modal
        visible={this.state.visibleModal}
        wrapClassName={styles.modal}
        title={<FormattedMessage id="pod.add" />}
        onCancel={this.hideCreate}
      >
        <PodForm networks={this.state.networks} />
      </Modal>
    );
  };

  public render() {
    const { currentPod } = this.state;
    return (
      <div>
        <Row>
          {this.props.allPods.map(pod => {
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
          </Drawer>
        )}
        <Button type="dashed" className={styles.add} onClick={this.showCreate}>
          <Icon type="plus" /> <FormattedMessage id="pod.add" />
        </Button>
        {this.renderCreateModal()}
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

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => ({
  fetchPods: () => dispatch(clusterOperations.fetchPods())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pod);
