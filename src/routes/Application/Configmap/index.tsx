import * as React from 'react';
import * as ConfigmapModel from '@/models/Configmap';
import { connect } from 'react-redux';
import { Button, Icon, Card, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Dispatch } from 'redux';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';
import { clusterOperations } from '@/store/ducks/cluster';
import { RootState, RootAction, RTDispatch } from '@/store/ducks';

import ItemActions from '@/components/ItemActions';

import withCapitalize from '@/containers/withCapitalize';

const CapitalizedMessage = withCapitalize(FormattedMessage);

type ConfigmapProps = OwnProps & InjectedAuthRouterProps & InjectedIntlProps;
interface OwnProps {
  configmaps: Array<ConfigmapModel.Configmap>;
  fetchConfigmaps: () => any;
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
              type: 'delete'
            }
          ]}
        />
      )
    }
  ];
  constructor(props: ConfigmapProps) {
    super(props);
  }
  public render() {
    return (
      <div>
        <Card
          title={<CapitalizedMessage id="configmap" />}
          extra={
            <Button>
              <Icon type="plus" /> <FormattedMessage id="configmap.add" />
            </Button>
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
  fetchConfigmaps: () => dispatch(clusterOperations.fetchConfigmaps())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Configmap));
