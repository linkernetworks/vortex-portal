import * as React from 'react';
import { connect } from 'react-redux';
import { Card, Button, Icon, Table, Popconfirm } from 'antd';
import * as moment from 'moment';
import { injectIntl, FormattedMessage, InjectedIntlProps } from 'react-intl';
import { ColumnProps } from 'antd/lib/table';

import * as styles from './styles.module.scss';
import { RootState, RTDispatch } from '@/store/ducks';
import { storageOperations } from '@/store/ducks/storage';
import {
  Storage as StorageModel,
  Volume as VolumeModel
} from '@/models/Storage';

interface StorageProps extends InjectedIntlProps {
  storages: Array<StorageModel>;
  volumes: Array<VolumeModel>;
  fetchStorages: () => any;
  fetchVolumes: () => any;
  removeStorage: (id: string) => any;
}

class Storage extends React.PureComponent<StorageProps, object> {
  private storageColumns: Array<ColumnProps<StorageModel>> = [
    {
      title: this.props.intl.formatMessage({ id: 'storage.name' }),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: this.props.intl.formatMessage({ id: 'storage.type' }),
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: this.props.intl.formatMessage({ id: 'storage.storageClassName' }),
      dataIndex: 'storageClassName',
      key: 'storageClassName'
    },
    {
      title: this.props.intl.formatMessage({ id: 'storage.ip' }),
      dataIndex: 'ip',
      key: 'ip'
    },
    {
      title: this.props.intl.formatMessage({ id: 'storage.path' }),
      dataIndex: 'path',
      key: 'path'
    },
    {
      title: this.props.intl.formatMessage({ id: 'createdAt' }),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => moment(text).calendar()
    },
    {
      title: this.props.intl.formatMessage({ id: 'action' }),
      render: (_, record) => {
        return (
          <Popconfirm title={<FormattedMessage id="action.confirmToDelete" />}>
            <a
              href="javascript:;"
              onClick={this.handleStorageDelete.bind(this, record.id)}
            >
              <FormattedMessage id="action.delete" />
            </a>
          </Popconfirm>
        );
      }
    }
  ];

  public componentDidMount() {
    this.props.fetchStorages();
  }

  protected handleStorageDelete = (id: string) => {
    this.props.removeStorage(id);
  };

  protected handleAddStorage = () => {
    return;
  };

  public renderTableFooter = () => {
    return (
      <Button
        type="dashed"
        className={styles.add}
        onClick={this.handleAddStorage}
      >
        <Icon type="plus" /> <FormattedMessage id="storage.add" />
      </Button>
    );
  };

  public render() {
    return (
      <div>
        <Card title={<FormattedMessage id="storage" />}>
          <Table
            rowKey="uid"
            columns={this.storageColumns}
            dataSource={this.props.storages}
            footer={this.renderTableFooter}
          />
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    storages: state.storage.storages,
    volumes: state.storage.volumes
  };
};

const mapDispatchToProps = (dispatch: RTDispatch) => ({
  fetchStorages: () => dispatch(storageOperations.fetchStorage()),
  fetchVolumes: () => dispatch(storageOperations.fetchVolumes()),
  removeStorage: (id: string) => dispatch(storageOperations.removeStorage(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Storage));
