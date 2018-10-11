import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Icon, Table, Tag, Popconfirm, Switch } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { get } from 'lodash';

import * as PodModel from '@/models/Pod';
import * as DeploymentModel from '@/models/Deployment';
import StatusIcon from '@/components/StatusIcon';
import ItemActions from '@/components/ItemActions';
import AutoscaleForm from '@/components/AutoscaleForm';

import * as styles from './styles.module.scss';
import withCapitalize from '@/containers/withCapitalize';

const CapitalizedMessage = withCapitalize(FormattedMessage);

interface DeploymentDetailProps {
  deployment: DeploymentModel.Controller;
  pods: PodModel.Pods;
  removeDeployment: (id: string) => void;
  autoscale: (data: DeploymentModel.Autoscale, enable: boolean) => any;
}

interface DeploymentDetailState {
  autoscale: boolean;
}

class DeploymentDetail extends React.PureComponent<
  DeploymentDetailProps,
  object
> {
  public state: DeploymentDetailState = {
    autoscale: !!get(this.props.deployment, 'isEnableAutoscale')
  };

  protected handleSubmit = (
    data: DeploymentModel.Autoscale,
    enable: boolean
  ) => {
    this.props.autoscale(data, enable);
  };

  protected getPodInfo = (pods: Array<string>) => {
    if (Object.keys(this.props.pods).length === 0) {
      return [];
    }

    return pods.map(pod => {
      if (!this.props.pods[pod]) {
        return {
          name: '',
          namespace: '',
          node: '',
          status: '',
          restarts: 0,
          createdAt: moment().fromNow()
        };
      }
      return {
        name: this.props.pods[pod].podName,
        namespace: this.props.pods[pod].namespace,
        node: this.props.pods[pod].node,
        status: this.props.pods[pod].status,
        restarts: this.props.pods[pod].restartCount,
        createdAt: moment(this.props.pods[pod].createAt * 1000).fromNow()
      };
    });
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

  protected renderPod = () => {
    const { deployment } = this.props;
    const columns: Array<ColumnProps<PodModel.PodInfo>> = [
      {
        title: <CapitalizedMessage id="name" />,
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: <CapitalizedMessage id="namespace" />,
        dataIndex: 'namespace'
      },
      {
        title: <CapitalizedMessage id="node" />,
        dataIndex: 'node'
      },
      {
        title: <CapitalizedMessage id="status" />,
        dataIndex: 'status'
      },
      {
        title: <CapitalizedMessage id="action" />,
        key: 'action',
        render: (_, record) => (
          <ItemActions
            items={[
              {
                type: 'link',
                link: {
                  to: { pathname: `/application/pod/${record.name}` },
                  replace: true
                }
              }
            ]}
          />
        )
      }
    ];
    return (
      <Table
        size="small"
        columns={columns}
        dataSource={this.getPodInfo(deployment.pods)}
        pagination={false}
      />
    );
  };

  protected renderAction = (id: string | undefined) => {
    if (!!id) {
      return (
        <Popconfirm
          key="action.delete"
          title={<CapitalizedMessage id="action.confirmToDelete" />}
          onConfirm={this.props.removeDeployment.bind(this, id)}
        >
          <Button>
            <Icon type="delete" /> <CapitalizedMessage id="deployment.delete" />
          </Button>
        </Popconfirm>
      );
    } else {
      return (
        <Button type="dashed" disabled={true}>
          <Icon type="delete" />
          <FormattedMessage id="deployment.undeletable" />
        </Button>
      );
    }
  };

  public render() {
    const { deployment } = this.props;
    return (
      <React.Fragment>
        <div className={styles.contentSection}>
          <h2 style={{ display: 'inline' }}>{deployment.controllerName}</h2>
          <StatusIcon status="running" />
        </div>

        <div className={styles.contentSection}>
          <h3>
            <CapitalizedMessage id="deployment.labels" />
          </h3>
          {this.renderLabels(deployment.labels)}
        </div>

        <div className={styles.contentSection}>
          <h3>Pods</h3>
          {this.renderPod()}
        </div>
        <div className={styles.drawerBottom}>
          {this.renderAction(deployment.id)}
        </div>

        <div className={styles.contentSection}>
          <h3 style={{ display: 'inline', marginRight: '8px' }}>Autoscale</h3>
          <Switch
            checked={this.state.autoscale}
            onChange={() =>
              this.setState({
                autoscale: !this.state.autoscale
              })
            }
          />
          <AutoscaleForm
            key={this.state.autoscale + ''}
            info={deployment.autoscalerInfo}
            enable={this.state.autoscale}
            namespace={deployment.namespace}
            controllerName={deployment.controllerName}
            onSubmit={this.handleSubmit}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default DeploymentDetail;
