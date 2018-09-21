import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Icon, Table, Tag, notification, Popconfirm } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';

import * as PodModel from '@/models/Pod';
import * as DeploymentModel from '@/models/Deployment';
import StatusIcon from '@/components/StatusIcon';
import ItemActions from '@/components/ItemActions';

import * as styles from './styles.module.scss';

interface DeploymentDetailProps {
  deployment: DeploymentModel.Controller;
  pods: PodModel.Pods;
  removeDeployment: (id: string) => void;
}

class DeploymentDetail extends React.PureComponent<
  DeploymentDetailProps,
  object
> {
  protected handleRemoveDeployment = (id: string) => {
    this.props.removeDeployment(id);
    return notification.success({
      message: 'Success',
      description: 'Delete the deployment successfully.'
    });
  };

  protected getPodInfo = (pods: Array<string>) => {
    if (Object.keys(this.props.pods).length === 0) {
      return [];
    }
    return pods.map(pod => ({
      name: this.props.pods[pod].podName,
      namespace: this.props.pods[pod].namespace,
      node: this.props.pods[pod].node,
      status: this.props.pods[pod].status,
      restarts: this.props.pods[pod].restartCount,
      createdAt: moment(this.props.pods[pod].createAt * 1000).fromNow()
    }));
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
        title: <FormattedMessage id="name" />,
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: <FormattedMessage id="namespace" />,
        dataIndex: 'namespace'
      },
      {
        title: <FormattedMessage id="node" />,
        dataIndex: 'node'
      },
      {
        title: <FormattedMessage id="status" />,
        dataIndex: 'status'
      },
      {
        title: <FormattedMessage id="action" />,
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
          title={<FormattedMessage id="action.confirmToDelete" />}
          onConfirm={this.handleRemoveDeployment.bind(this, id)}
        >
          <Button>
            <Icon type="delete" /> <FormattedMessage id="deployment.delete" />
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
            <FormattedMessage id="deployment.labels" />
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
      </React.Fragment>
    );
  }
}

export default DeploymentDetail;
