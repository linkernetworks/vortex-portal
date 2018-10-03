import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Button, Tag, Radio, Row, Col } from 'antd';

import * as moment from 'moment';

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

import * as containerAPI from '@/services/container';
import * as ContainerModel from '@/models/Container';
import StatusIcon from '@/components/StatusIcon';
import ModalTerminal from '@/components/ModalTerminal';
import ModalContainerLogs from '@/components/ModalContainerLogs';

import * as styles from './styles.module.scss';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

type ContainerDetailProps = OwnProps & InjectedIntlProps;

interface OwnProps {
  container: ContainerModel.Container;
}

interface ContainerDetailState {
  containerTimeUnit: string;
  resource: {
    now: ContainerModel.Resource | undefined;
    day: ContainerModel.Resource | undefined;
    week: ContainerModel.Resource | undefined;
  };
  execIdentifier?: {
    namespace: string;
    podName: string;
    containerName: string;
  };
  logsIdentifier?: {
    namespace: string;
    podName: string;
    containerName: string;
  };
}

class ContainerDetail extends React.PureComponent<
  ContainerDetailProps,
  ContainerDetailState
> {
  private intervalContainerId: number;
  public state: ContainerDetailState = {
    containerTimeUnit: 'now',
    resource: {
      now: undefined,
      week: undefined,
      day: undefined
    }
  };

  public componentDidMount() {
    this.queryResource();
    this.intervalContainerId = window.setInterval(this.queryResource, 1000);
  }

  public componentWillUnmount() {
    clearInterval(this.intervalContainerId);
  }

  protected queryResource = () => {
    const { container } = this.props;
    containerAPI
      .getContainer(container.detail.pod, container.detail.containerName)
      .then(res => {
        this.setState({
          resource: {
            ...this.state.resource,
            now: res.data.resource
          }
        });
      });
  };

  protected handleSwitchContainerTimeUnit = (e: any) => {
    const { container } = this.props;
    const containerTimeUnit = e.target.value;

    if (
      containerTimeUnit !== 'now' &&
      !this.state.resource[containerTimeUnit]
    ) {
      containerAPI
        .getContainer(
          container.detail.pod,
          container.detail.containerName,
          containerTimeUnit
        )
        .then(res => {
          this.setState({
            resource: {
              ...this.state.resource,
              [containerTimeUnit]: res.data.resource
            },
            containerTimeUnit
          });
        });
    } else {
      this.setState({ containerTimeUnit });
    }
  };

  protected handleOpenLogs = () => {
    const { container } = this.props;
    this.setState({
      logsIdentifier: {
        namespace: container.detail.namespace,
        podName: container.detail.pod,
        containerName: container.detail.containerName
      }
    });
  };

  protected handleOpenExec = () => {
    const { container } = this.props;
    this.setState({
      execIdentifier: {
        namespace: container.detail.namespace,
        podName: container.detail.pod,
        containerName: container.detail.containerName
      }
    });
  };

  protected handleCloseLogs = () => {
    this.setState({
      logsIdentifier: undefined
    });
  };

  protected handleCloseExec = () => {
    this.setState({
      execIdentifier: undefined
    });
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

  protected renderContainerDetail = (container: ContainerModel.Detail) => {
    return (
      <div>
        <Row>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`status`} />,
              container.status
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`namespace`} />,
              container.namespace
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`container.detail.image`} />,
              container.image
            )}
          </Col>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`createdAt`} />,
              moment(container.createAt * 1000).calendar()
            )}
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            {this.renderListItemContent(
              <FormattedMessage id={`node`} />,
              container.node
            )}
          </Col>
        </Row>
      </div>
    );
  };

  protected renderCommands = (commands: Array<string>) => {
    return (
      <div className={styles.commands}>
        {(commands != null &&
          commands.map(command => (
            <Tag color="green" className={styles.command} key={command}>
              {command}
            </Tag>
          ))) ||
          (commands == null && 'null')}
      </div>
    );
  };

  protected renderContainerChart(
    data: Array<{ timestamp: number; value: string }>,
    toMB: boolean,
    label: string
  ) {
    const chartData: Array<{ x: string; y1: number }> = [];
    if (data !== null && data.length > 0) {
      data.map(d => {
        const y1 = parseFloat(d.value);
        if (toMB) {
          chartData.push({
            x: moment(d.timestamp * 1000).calendar(),
            y1: parseFloat((y1 / (1024 * 1024)).toFixed(2))
          });
        } else {
          chartData.push({
            x: moment(d.timestamp * 1000).calendar(),
            y1
          });
        }
      });
    }
    return (
      <ResponsiveContainer width={'90%'} height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 60, right: 8, left: 8, bottom: 24 }}
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
            name="Usage"
            dataKey="y1"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  protected renderResource = () => {
    const { formatMessage } = this.props.intl;
    const { containerTimeUnit, resource } = this.state;
    const currentResource = resource[containerTimeUnit];

    if (!currentResource) {
      return null;
    }

    return (
      <div>
        <RadioGroup
          className={styles.radioGroup}
          defaultValue="now"
          buttonStyle="solid"
          onChange={this.handleSwitchContainerTimeUnit}
        >
          <RadioButton value="week">Week</RadioButton>
          <RadioButton value="day">Day</RadioButton>
          <RadioButton value="now">Now</RadioButton>
        </RadioGroup>
        <Row>
          <Col span={24}>
            <div className={styles.chart}>
              {this.renderContainerChart(
                currentResource.cpuUsagePercentage,
                false,
                formatMessage({
                  id: 'container.resource.cpuUsagePercentage'
                })
              )}
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.chart}>
              {this.renderContainerChart(
                currentResource.memoryUsageBytes,
                true,
                formatMessage({
                  id: 'container.resource.memoryUsageMegabyte'
                })
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  public render() {
    const { container } = this.props;

    if (!container) {
      return <div />;
    }

    return (
      <React.Fragment>
        <div className={styles.contentSection}>
          <h2 style={{ display: 'inline' }}>
            {container.detail.containerName}
          </h2>
          <StatusIcon status={container.detail.status} />
        </div>

        <div className={styles.contentSection}>
          <h3>
            <FormattedMessage id="detail" />
          </h3>
          {this.renderContainerDetail(container.detail)}
        </div>

        <div className={styles.contentSection}>
          <h3>
            <FormattedMessage id="commands" />
          </h3>
          {this.renderCommands(container.detail.command)}
        </div>

        <div className={styles.contentSection}>
          <h3>
            <FormattedMessage id="actions" />
          </h3>
          <Button style={{ marginRight: '10px' }} onClick={this.handleOpenLogs}>
            <FormattedMessage id="container.openLogs" />
          </Button>
          <Button onClick={this.handleOpenExec}>
            <FormattedMessage id="container.openTerminal" />
          </Button>
        </div>

        <div className={styles.contentSection}>
          <h3>
            <FormattedMessage id="resource" />
          </h3>
          {this.renderResource()}
        </div>

        <ModalContainerLogs
          title={container.detail.containerName}
          logsIdentifier={this.state.logsIdentifier}
          onCloseModal={this.handleCloseLogs}
        />

        <ModalTerminal
          title={container.detail.containerName}
          execIdentifier={this.state.execIdentifier}
          onCloseModal={this.handleCloseExec}
        />
      </React.Fragment>
    );
  }
}

export default injectIntl(ContainerDetail);
