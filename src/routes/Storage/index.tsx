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
import VolumeForm from '@/components/VolumeForm';
import { RootState, RTDispatch, RootAction } from '@/store/ducks';
import { storageOperations, storageActions } from '@/store/ducks/storage';
import { volumeOperations, volumeActions } from '@/store/ducks/volume';
import {
  Storage as StorageModel,
  StorageFields,
  Volume as VolumeModel,
  VolumeFields,
  AccessMode
} from '@/models/Storage';
import { FormField } from '@/utils/types';

interface StorageProps {
  storages: {
    data: Array<StorageModel>;
    isLoading: boolean;
    error: Error | null;
  };
  volumes: {
    data: Array<VolumeModel>;
    isLoading: boolean;
    error: Error | null;
  };
  fetchStorages: () => any;
  fetchVolumes: () => any;
  addStorage: (data: StorageFields) => any;
  addVolume: (data: VolumeFields) => any;
  removeStorage: (id: string) => any;
  removeVolume: (id: string) => any;
  clearStorageError: () => any;
  clearVolumeError: () => any;
}

interface StorageState {
  isCreatingStorage: boolean;
  isCreatingVolume: boolean;
  tabKey: string;
  storageFields: FormField<StorageFields>;
  volumeFields: FormField<VolumeFields>;
}

const tabList = [
  {
    key: 'storage',
    tab: <FormattedMessage id="storage" />
  },
  {
    key: 'volume',
    tab: <FormattedMessage id="volume" />
  }
];

class Storage extends React.PureComponent<
  StorageProps & InjectedIntlProps,
  StorageState
> {
  private actionColumn: ColumnProps<StorageModel | VolumeModel> = {
    title: this.props.intl.formatMessage({ id: 'action' }),
    render: (_, record) => {
      return (
        <Popconfirm
          title={<FormattedMessage id="action.confirmToDelete" />}
          onConfirm={this.handleItemDelete.bind(this, record.id)}
        >
          <a href="javascript:;">
            <FormattedMessage id="action.delete" />
          </a>
        </Popconfirm>
      );
    }
  };

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
    this.actionColumn
  ];

  private volumeColumns: Array<ColumnProps<VolumeModel>> = [
    {
      title: this.props.intl.formatMessage({ id: 'volume.name' }),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: this.props.intl.formatMessage({ id: 'volume.storageName' }),
      dataIndex: 'storageName',
      key: 'storageName'
    },
    {
      title: this.props.intl.formatMessage({ id: 'volume.accessMode' }),
      dataIndex: 'accessMode',
      key: 'accessMode'
    },
    {
      title: this.props.intl.formatMessage({ id: 'createdAt' }),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => moment(text).calendar()
    },
    this.actionColumn
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
        value: AccessMode.ReadWriteMany
      },
      capacity: {
        value: '300Gi'
      }
    };
  };

  constructor(props: StorageProps & InjectedIntlProps) {
    super(props);
    this.state = {
      isCreatingStorage: false,
      isCreatingVolume: false,
      tabKey: 'storage',
      storageFields: this.storageFactory(),
      volumeFields: this.volumeFactory()
    };
  }

  public componentWillMount() {
    this.props.fetchStorages();
    this.props.fetchVolumes();
  }

  protected getFlatFormFieldValue = (target: string) => {
    return mapValues(this.state[target], 'value');
  };

  protected handleItemDelete = (id: string) => {
    const { tabKey } = this.state;
    switch (tabKey) {
      case 'storage':
        this.props.removeStorage(id);
      case 'volume':
        this.props.removeVolume(id);
    }
  };

  protected handleAddItem = () => {
    this.setState(prevState => {
      switch (prevState.tabKey) {
        case 'storage':
          return {
            ...prevState,
            isCreatingStorage: true
          };
        case 'volume':
          return {
            ...prevState,
            isCreatingVolume: true
          };
        default:
          return prevState;
      }
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
    this.props.clearVolumeError();
    this.setState({
      isCreatingStorage: false,
      isCreatingVolume: false,
      storageFields: this.storageFactory(),
      volumeFields: this.volumeFactory()
    });
  };

  protected handleStorageSubmit = () => {
    const { tabKey } = this.state;

    switch (tabKey) {
      case 'storage':
        this.props.clearStorageError();
        this.props
          .addStorage(this.getFlatFormFieldValue(
            'storageFields'
          ) as StorageFields)
          .then(() => {
            if (!this.props.storages.error) {
              this.setState({
                isCreatingStorage: false,
                storageFields: this.storageFactory()
              });
            }
          });
      case 'volume':
        this.props.clearVolumeError();
        this.props
          .addVolume(this.getFlatFormFieldValue('volumeFields') as VolumeFields)
          .then(() => {
            if (!this.props.volumes.error) {
              this.setState({
                isCreatingVolume: false,
                volumeFields: this.volumeFactory()
              });
            }
          });
    }
  };

  public renderTableFooter = () => {
    const { tabKey } = this.state;
    return (
      <Button type="dashed" className={styles.add} onClick={this.handleAddItem}>
        <Icon type="plus" /> <FormattedMessage id={`${tabKey}.add`} />
      </Button>
    );
  };

  public renderTabContent = () => {
    const {
      storages,
      volumes,
      clearStorageError,
      clearVolumeError
    } = this.props;

    const {
      tabKey,
      storageFields,
      volumeFields,
      isCreatingStorage,
      isCreatingVolume
    } = this.state;

    const storageOptions = storages.data.map(storage => storage.name);

    switch (tabKey) {
      case 'storage':
        return (
          <React.Fragment>
            <Table
              rowKey="id"
              columns={this.storageColumns}
              dataSource={storages.data}
              footer={this.renderTableFooter}
            />
            <StorageForm
              {...storageFields}
              visiable={isCreatingStorage}
              isLoading={storages.isLoading}
              error={storages.error}
              onCancel={this.handleFormClose}
              onChange={this.handleFormChange('storageFields')}
              onSubmit={this.handleStorageSubmit}
              onCloseError={clearStorageError}
            />
          </React.Fragment>
        );
      case 'volume':
        return (
          <React.Fragment>
            <Table
              rowKey="id"
              columns={this.volumeColumns}
              dataSource={volumes.data}
              footer={this.renderTableFooter}
            />
            <VolumeForm
              {...volumeFields}
              visiable={isCreatingVolume}
              isLoading={volumes.isLoading}
              error={volumes.error}
              storageNameOptions={storageOptions}
              onCancel={this.handleFormClose}
              onChange={this.handleFormChange('volumeFields')}
              onSubmit={this.handleStorageSubmit}
              onCloseError={clearVolumeError}
            />
          </React.Fragment>
        );
      default:
        return null;
    }
  };

  public render() {
    const { tabKey } = this.state;

    return (
      <div>
        <Card
          className={styles.card}
          tabList={tabList}
          activeTabKey={tabKey}
          onTabChange={key => {
            this.setState({ tabKey: key });
          }}
        >
          {this.renderTabContent()}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    storages: {
      data: state.storage.storages,
      isLoading: state.storage.isLoading,
      error: state.storage.error
    },
    volumes: {
      data: state.volume.volumes,
      isLoading: state.volume.isLoading,
      error: state.volume.error
    }
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => ({
  fetchStorages: () => dispatch(storageOperations.fetchStorage()),
  fetchVolumes: () => dispatch(volumeOperations.fetchVolumes()),
  addStorage: (data: StorageFields) =>
    dispatch(storageOperations.addStorage(data)),
  addVolume: (data: VolumeFields) => dispatch(volumeOperations.addVolume(data)),
  removeStorage: (id: string) => dispatch(storageOperations.removeStorage(id)),
  removeVolume: (id: string) => dispatch(volumeOperations.removeVolume(id)),
  clearStorageError: () => dispatch(storageActions.clearStorageError()),
  clearVolumeError: () => dispatch(volumeActions.clearVolumeError())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Storage));
