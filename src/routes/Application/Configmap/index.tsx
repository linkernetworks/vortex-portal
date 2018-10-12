import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import * as ConfigmapModel from '@/models/Configmap';
import { connect } from 'react-redux';
import { Button, Icon, Card, Table, notification } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Dispatch } from 'redux';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';
import { clusterOperations } from '@/store/ducks/cluster';
import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import * as styles from './styles.module.scss';

import ItemActions from '@/components/ItemActions';

import withCapitalize from '@/containers/withCapitalize';

const CapitalizedMessage = withCapitalize(FormattedMessage);

type ConfigmapProps = OwnProps &
  InjectedAuthRouterProps &
  InjectedIntlProps &
  RouteComponentProps<{ name: string }>;
interface OwnProps {
  configmaps: Array<ConfigmapModel.Configmap>;
  fetchConfigmaps: () => any;
  removeConfigmap: (id: string) => any;
}

class Configmap extends React.Component<ConfigmapProps, object> {
  private columns: Array<ColumnProps<ConfigmapModel.Configmap>> = [
    {
      title: <CapitalizedMessage id="name" />,
      dataIndex: 'name'
    },
    {
      title: <CapitalizedMessage id="owner" />,
      dataIndex: 'owner'
    },
    {
      title: <CapitalizedMessage id="namespace" />,
      dataIndex: 'namespace'
    },
    {
      title: <CapitalizedMessage id="createdAt" />,
      dataIndex: 'createdAt'
    },
    {
      title: <CapitalizedMessage id="action" />,
      key: 'action',
      render: (_, record) => (
        <ItemActions
          items={[
            {
              type: 'delete',
              onConfirm: this.handleRemoveConfigmap.bind(this, record.id)
            }
          ]}
        />
      )
    }
  ];
  constructor(props: ConfigmapProps) {
    super(props);
  }

  protected handleRemoveConfigmap = (id: string) => {
    this.props.removeConfigmap(id);

    const { formatMessage } = this.props.intl;
    notification.success({
      message: formatMessage({
        id: 'action.success'
      }),
      description: formatMessage({
        id: 'configmap.hint.delete.success'
      })
    });
  };

  public componentDidMount() {
    this.props.fetchConfigmaps();
  }

  public render() {
    return (
      <div>
        <Card
          title={<CapitalizedMessage id="configmap" />}
          extra={
            <Link className={styles.action} to="/application/configmap/create">
              <Button>
                <Icon type="plus" /> <FormattedMessage id="configmap.add" />
              </Button>
            </Link>
          }
        >
          <Table
            className="main-table"
            columns={this.columns}
            dataSource={this.props.configmaps}
          />
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    configmaps: state.cluster.configmaps
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => ({
  fetchConfigmaps: () => dispatch(clusterOperations.fetchConfigmaps()),
  removeConfigmap: (id: string) =>
    dispatch(clusterOperations.removeConfigmap(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Configmap));
