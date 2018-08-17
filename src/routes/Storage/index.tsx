import * as React from 'react';
import { connect } from 'react-redux';
import { Card, Button, Icon, Table, Popconfirm } from 'antd';
import { injectIntl, FormattedMessage, InjectedIntlProps } from 'react-intl';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { mapValues } from 'lodash';
import { Dispatch } from 'redux';

import * as styles from './styles.module.scss';
import StorageForm from '@/components/StorageForm';
import { RootState, RTDispatch, RootAction } from '@/store/ducks';
import { storageOperations, storageActions } from '@/store/ducks/storage';
import {
  Storage as StorageModel,
  StorageFields,
  Volume as VolumeModel,
  VolumeFields
} from '@/models/Storage';
import { FormField } from '@/utils/types';

interface StorageProps {
  storages: Array<StorageModel>;
  volumes: Array<VolumeModel>;
  isLoading: boolean;
  error: Error | null;
  fetchStorages: () => any;
  fetchVolumes: () => any;
  addStorage: (data: StorageFields) => any;
  removeStorage: (id: string) => any;
  clearStorageError: () => any;
}

interface StorageState {
  isCreatingStorage: boolean;
  isCreatingVolume: boolean;
  storageFields: FormField<StorageFields>;
  volumeFields: FormField<VolumeFields>;
}

class Storage extends React.PureComponent<
  StorageProps & InjectedIntlProps,
  StorageState
> {
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
          <Popconfirm
            title={<FormattedMessage id="action.confirmToDelete" />}
            onConfirm={this.handleStorageDelete.bind(this, record.id)}
          >
            <a href="javascript:;">
              <FormattedMessage id="action.delete" />
            </a>
          </Popconfirm>
        );
      }
    }
  ];

  private storageFactory = () => {
    return {
      name: {
        value: ''
      },
      type: {
        value: 'nfs'
      },
      ip: {
        value: ''
      },
      path: {
        value: ''
      }
    };
  };

  private volumeFactory = () => {
    return {
      name: {
        value: ''
      },
      storageName: {
        value: ''
      },
      accessMode: {
        value: ''
      },
      capcity: {
        value: '300'
      }
    };
  };

  constructor(props: StorageProps & InjectedIntlProps) {
    super(props);
    this.state = {
      isCreatingStorage: false,
      isCreatingVolume: false,
      storageFields: this.storageFactory(),
      volumeFields: this.volumeFactory()
    };
  }

  public componentWillMount() {
    this.props.fetchStorages();
  }

  protected getFlatFormFieldValue = (target: string) => {
    return mapValues(this.state[target], 'value');
  };

  protected handleStorageDelete = (id: string) => {
    this.props.removeStorage(id);
  };

  protected handleAddStorage = () => {
    this.setState({
      isCreatingStorage: true
    });
  };

  protected handleFormChange = (target: string) => (changedFields: any) => {
    this.setState(prevState => {
      return {
        ...prevState,
        [target]: {
          ...prevState[target],
          ...changedFields
        }
      };
    });
  };

  protected handleFormClose = () => {
    this.props.clearStorageError();
    this.setState({
      isCreatingStorage: false,
      storageFields: this.storageFactory(),
      volumeFields: this.volumeFactory()
    });
  };

  protected handleStorageSubmit = () => {
    this.props.clearStorageError();
    this.props
      .addStorage(this.getFlatFormFieldValue('storageFields') as StorageFields)
      .then(() => {
        if (!this.props.error) {
          this.setState({
            isCreatingStorage: false,
            storageFields: this.storageFactory()
          });
        }
      });
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
    const { storages, isLoading, error, clearStorageError } = this.props;
    return (
      <div>
        <Card title={<FormattedMessage id="storage" />}>
          <Table
            rowKey="id"
            columns={this.storageColumns}
            dataSource={storages}
            footer={this.renderTableFooter}
          />
        </Card>
        <StorageForm
          {...this.state.storageFields}
          visiable={this.state.isCreatingStorage}
          isLoading={isLoading}
          error={error}
          onCancel={this.handleFormClose}
          onChange={this.handleFormChange('storageFields')}
          onSubmit={this.handleStorageSubmit}
          onCloseError={clearStorageError}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    storages: state.storage.storages,
    volumes: state.storage.volumes,
    isLoading: state.storage.isLoading,
    error: state.storage.error
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => ({
  fetchStorages: () => dispatch(storageOperations.fetchStorage()),
  fetchVolumes: () => dispatch(storageOperations.fetchVolumes()),
  addStorage: (data: StorageFields) =>
    dispatch(storageOperations.addStorage(data)),
  removeStorage: (id: string) => dispatch(storageOperations.removeStorage(id)),
  clearStorageError: () => dispatch(storageActions.clearStorageError())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Storage));
