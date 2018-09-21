import * as React from 'react';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Tag,
  Button,
  Icon,
  Spin,
  Tabs,
  Radio,
  Table,
  notification,
  Popconfirm,
  Card,
  Drawer
} from 'antd';
import { ColumnProps } from 'antd/lib/table';

import * as moment from 'moment';
import { get } from 'lodash';
import {
  LineChart,
  Line,
  Label,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

import { RootState, RTDispatch } from '@/store/ducks';
import * as podAPI from '@/services/pod';
import * as containerAPI from '@/services/container';
import * as PodModel from '@/models/Pod';
import * as ContainerModel from '@/models/Container';
import { clusterOperations, clusterSelectors } from '@/store/ducks/cluster';
import StatusIcon from '@/components/StatusIcon';
import ItemActions from '@/components/ItemActions';
import ContainerDetail from '@/components/ContainerDetail';

import * as styles from './styles.module.scss';

const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

type PodDetailProps = OwnProps &
  InjectedAuthRouterProps &
  InjectedIntlProps &
  RouteComponentProps<{ name: string }>;

interface OwnProps {
  pod: PodModel.Pod | undefined;
  podNics: PodModel.NICS | undefined;
  containers: Array<ContainerModel.Container>;
  fetchPod: (pod: string) => any;
  removePodByName: (namespace: string, id: string) => any;
}

interface PodDetailState {
  isNotFound: boolean;
  containers: Array<ContainerModel.Container>;
  localPodNics: {
    week: PodModel.NICS | undefined;
    day: PodModel.NICS | undefined;
  };
  currentContainerName: string;
  podTimeUnit: string;
}

class PodDetail extends React.PureComponent<PodDetailProps, PodDetailState> {
  private intervalPodId: number;
  public state: PodDetailState = {
    isNotFound: false,
    localPodNics: {
      week: undefined,
      day: undefined
    },
    containers: [],
    currentContainerName: '',
    podTimeUnit: 'now'
  };

  public async componentDidMount() {
    const podName = this.props.match.params.name;

    if (!this.props.pod) {
      // TODO: it's bad to access action type out of reducer
      const action: any = await this.props.fetchPod(podName);
      if (action.payload.podName === '') {
        this.setState({ isNotFound: true });
        return;
      }
    }

    Promise.all(
      this.props.pod!.containers.map(container => {
        return containerAPI.getContainer(podName, container);
      })
    ).then(responses => {
      this.setState({ containers: responses.map(res => res.data) });
    });

    this.intervalPodId = window.setInterval(
      this.props.fetchPod.bind(this, podName),
      5000
    );
  }

  public componentWillUnmount() {
    clearInterval(this.intervalPodId);
  }

  protected handleRemovePod = (namespace: string, id: string) => {
    this.props.removePodByName(namespace, id);
    return notification.success({
      message: 'Success',
      description: 'Delete the pod successfully.'
    });
  };

  protected handleSwitchPodTimeUnit = (e: any) => {
    const { pod } = this.props;
    const podTimeUnit = e.target.value;

    if (podTimeUnit !== 'now' && !this.state.localPodNics[podTimeUnit]) {
      podAPI.getPod(pod!.podName, podTimeUnit).then(res => {
        this.setState({
          localPodNics: {
            ...this.state.localPodNics,
            [podTimeUnit]: res.data.nics
          },
          podTimeUnit
        });
      });
    } else {
      this.setState({ podTimeUnit });
    }
  };

  protected showMoreContainer = (container: string) => {
    this.setState({ currentContainerName: container });
  };

  protected hideMoreContainer = () => {
    this.setState({ currentContainerName: '' });
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

  protected renderLabels = (labels: Map<string, string>) => {
    const list = Object.keys(labels);
    return (
      <div className={styles.labels}>
        {list.length === 0
          ? 'none'
          : list.map(key => (
              <Tag color="blue" className={styles.label} key={key}>
                {key} : {labels[key]}
              </Tag>
            ))}
      </div>
    );
  };

  protected renderDetail = () => {
    const { pod } = this.props;
    if (!pod) {
      return <div />;
    }
    return (
      <Row>
        <Col span={6}>
          {this.renderListItemContent(
            <FormattedMessage id="status" />,
            pod.status
          )}
        </Col>
        <Col span={6}>
          {this.renderListItemContent(
            <FormattedMessage id="createdAt" />,
            moment(pod.createAt * 1000).calendar()
          )}
        </Col>
        <Col span={6}>
          {this.renderListItemContent(<FormattedMessage id="pod.ip" />, pod.ip)}
        </Col>
        <Col span={6}>
          {this.renderListItemContent(
            <FormattedMessage id="namespace" />,
            pod.namespace
          )}
        </Col>
        <Col span={6}>
          {this.renderListItemContent(
            <FormattedMessage id="pod.createByName" />,
            pod.createByName
          )}
        </Col>
        <Col span={6}>
          {this.renderListItemContent(
            <FormattedMessage id="pod.restartCount" />,
            pod.restartCount
          )}
        </Col>
        <Col span={6}>
          {this.renderListItemContent(<FormattedMessage id="node" />, pod.node)}
        </Col>
        <Col span={6}>
          {this.renderListItemContent(
            <FormattedMessage id="pod.createByKind" />,
            pod.createByKind
          )}
        </Col>
      </Row>
    );
  };

  protected renderPodChart(
    data1: Array<{ timestamp: number; value: string }>,
    data2: Array<{ timestamp: number; value: string }>,
    toMB: boolean,
    label: string
  ) {
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
      <ResponsiveContainer width={'90%'} minWidth={720} height={420}>
        <LineChart
          data={chartData}
          margin={{ top: 60, right: 16, left: 16, bottom: 24 }}
        >
          <XAxis dataKey="x" />
          <YAxis>
            <Label
              value={label}
              position="insideTopLeft"
              className={styles.label}
            />
          </YAxis>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            dot={false}
            type="monotone"
            name="Receive Usage"
            dataKey="y1"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            dot={false}
            type="monotone"
            name="Transmit Usage"
            dataKey="y2"
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  protected renderContainer = () => {
    // TODO: i18n
    const columns: Array<ColumnProps<ContainerModel.Container>> = [
      {
        title: 'Name',
        dataIndex: 'detail.containerName',
        key: 'name'
      },
      {
        title: 'Status',
        dataIndex: 'detail.status',
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
        title: <FormattedMessage id="action" />,
        key: 'action',
        render: (_, record: ContainerModel.Container) => (
          <ItemActions
            items={[
              {
                type: 'more',
                onConfirm: this.showMoreContainer.bind(
                  this,
                  record.detail.containerName
                )
              }
            ]}
          />
        )
      }
    ];
    return (
      <Table
        rowKey={record => record.detail.containerName}
        size="small"
        columns={columns}
        dataSource={this.state.containers}
        pagination={false}
      />
    );
  };

  protected renderInterface = () => {
    const { podNics } = this.props;
    const { formatMessage } = this.props.intl;
    const { podTimeUnit, localPodNics } = this.state;

    const currentPodNic =
      podTimeUnit !== 'now' ? localPodNics[podTimeUnit] : podNics;

    if (!currentPodNic) {
      return <div />;
    }

    return (
      <Tabs>
        {Object.keys(currentPodNic).map(name => (
          <TabPane tab={name} key={name}>
            <RadioGroup
              className={styles.radioGroup}
              defaultValue="now"
              buttonStyle="solid"
              onChange={this.handleSwitchPodTimeUnit}
            >
              <RadioButton value="week">Week</RadioButton>
              <RadioButton value="day">Day</RadioButton>
              <RadioButton value="now">Now</RadioButton>
            </RadioGroup>
            <Row>
              <Col span={24}>
                <div className={styles.chart}>
                  {this.renderPodChart(
                    currentPodNic[name].nicNetworkTraffic.receiveBytesTotal,
                    currentPodNic[name].nicNetworkTraffic.transmitBytesTotal,
                    true,
                    formatMessage({
                      id: 'pod.nicNetworkTraffic.TXRXMegabyteTotal'
                    })
                  )}
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.chart}>
                  {this.renderPodChart(
                    currentPodNic[name].nicNetworkTraffic.receivePacketsTotal,
                    currentPodNic[name].nicNetworkTraffic.transmitPacketsTotal,
                    false,
                    formatMessage({
                      id: 'pod.nicNetworkTraffic.TXRXPacketsTotal'
                    })
                  )}
                </div>
              </Col>
            </Row>
          </TabPane>
        ))}
      </Tabs>
    );
  };

  protected renderAction = (pod: PodModel.Pod | null) => {
    if (pod !== null) {
      return (
        <Popconfirm
          key="action.delete"
          title={<FormattedMessage id="action.confirmToDelete" />}
          onConfirm={this.handleRemovePod.bind(
            this,
            pod.namespace,
            pod.podName
          )}
        >
          <Button>
            <Icon type="delete" /> <FormattedMessage id="pod.delete" />
          </Button>
        </Popconfirm>
      );
    } else {
      return (
        <Button type="dashed" disabled={true}>
          <Icon type="delete" /> <FormattedMessage id="pod.undeletable" />
        </Button>
      );
    }
  };

  public render() {
    const currentPod = this.props.match.params.name;
    const { pod } = this.props;
    const { isNotFound, containers, currentContainerName } = this.state;
    const isLoading = !pod && !isNotFound;
    const isOpenDrawer = !!currentContainerName;
    const currentContainer = containers.find(
      container => container.detail.containerName === currentContainerName
    );

    return (
      <React.Fragment>
        <Card
          title={
            <React.Fragment>
              <span style={{ fontSize: '1.2em' }}>{currentPod}</span>
              <StatusIcon status={get(pod, 'status') || 'custom-loading'} />
            </React.Fragment>
          }
        >
          {isLoading ? (
            <Spin />
          ) : isNotFound ? (
            'Not Found'
          ) : (
            <React.Fragment>
              <div className={styles.contentSection}>
                <h3>Details</h3>
                {this.renderDetail()}
              </div>
              <div className={styles.contentSection}>
                <h3>
                  <FormattedMessage id="pod.labels" />
                </h3>
                {this.renderLabels(pod!.labels)}
              </div>

              <div className={styles.contentSection}>
                <h3>Containers</h3>
                {this.renderContainer()}
              </div>
              <h3>Interface</h3>
              {this.renderInterface()}
            </React.Fragment>
          )}
        </Card>
        <Drawer
          title={<FormattedMessage id="container" />}
          width={720}
          visible={isOpenDrawer}
          onClose={this.hideMoreContainer}
        >
          {currentContainer && <ContainerDetail container={currentContainer} />}
        </Drawer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: PodDetailProps) => {
  const currentPod = ownProps.match.params.name;

  return {
    pod: state.cluster.pods[currentPod],
    podNics: state.cluster.podsNics[currentPod],
    pods: clusterSelectors.getPodsInAvailableNamespace(state.cluster)
  };
};

const mapDispatchToProps = (dispatch: RTDispatch) => ({
  fetchPod: (pod: string) => dispatch(clusterOperations.fetchPod(pod)),
  removePodByName: (namespace: string, id: string) =>
    dispatch(clusterOperations.removePodByName(namespace, id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(PodDetail));
