import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { map, isEmpty, mapValues } from 'lodash';
import { Modal, Form, Button, Icon, Select, Input, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';

import * as styles from './styles.module.scss';
import EditableTagGroup from '@/components/EditableTagGroup';
import { FormField } from '@/utils/types';
import * as Network from '@/models/Network';
import * as Node from '@/models/Node';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

interface NetworkFormProps {
  visible: boolean;
  isLoading: boolean;
  nodes: Node.Nodes;
  nodesWithUsedInterfaces: {
    [node: string]: Array<string>;
  };
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

interface NetworkFormState extends FormField<Network.NetworkFields> {}

class NetworkForm extends React.PureComponent<
  NetworkFormProps,
  NetworkFormState
> {
  constructor(props: NetworkFormProps) {
    super(props);
    this.state = this.stateFactory();
  }

  protected nodeFactory = () => {
    return {
      name: '',
      physicalInterfaces: []
    };
  };

  protected stateFactory = () => {
    return {
      name: {
        value: ''
      },
      type: {
        value: Network.dataPathType.system
      },
      isDPDKPort: {
        value: false
      },
      nodes: {
        value: [this.nodeFactory()]
      },
      vlanTags: {
        value: []
      }
    };
  };

  protected getFlatFormFieldValue = () => {
    const flatted = mapValues(this.state, 'value') as Network.NetworkFields;
    if (!this.state.isDPDKPort.value) {
      flatted.nodes!.forEach(node => {
        node.physicalInterfaces.forEach(
          physicalInterface => (physicalInterface.pciID = '')
        );
      });
    }
    return flatted;
  };

  protected getTypeRadioValue = () => {
    const { type, isDPDKPort } = this.state;
    if (type.value === Network.dataPathType.system) {
      return 'system';
    } else {
      return isDPDKPort.value ? 'dpdk' : 'netdev';
    }
  };

  protected getInterfaces = (nodeName: string) => {
    const { nodes, nodesWithUsedInterfaces } = this.props;
    return nodeName === ''
      ? []
      : map(nodes[nodeName].nics, (item, key) => {
          return {
            name: key,
            pciID: item.pciID
          };
        }).filter(
          physicalInterface =>
            nodesWithUsedInterfaces[nodeName].indexOf(
              physicalInterface.name
            ) === -1
        );
  };

  protected getAvailableNodeList = (selfIdx: number) => {
    const { nodes } = this.props;
    const self = this.state.nodes.value[selfIdx].name;
    const usedList = this.state.nodes.value.map(node => node.name);
    return Object.keys(nodes).filter(
      node => self === node || usedList.indexOf(node) === -1
    );
  };

  protected checkRequired = (field: keyof FormField<Network.NetworkFields>) => {
    const value = this.state[field].value;
    const changed = {};
    let result;

    switch (typeof value) {
      case 'string':
        result = value !== '';
      case 'object':
        result = !isEmpty(value);
    }

    changed[field] = {
      ...this.state[field],
      validateStatus: result ? 'success' : 'error',
      errorMsg: result ? (
        ''
      ) : (
        <FormattedMessage
          id="form.message.requred"
          values={{
            field: <FormattedMessage id={`network.${field}`} />
          }}
        />
      )
    };
    this.setState(changed);
  };

  protected checkVLANTag = (value: number | string) => {
    const trimmed =
      typeof value === 'string' ? (value.trim() === '' ? NaN : +value) : value;
    const result = Number.isInteger(trimmed) && trimmed >= 0 && trimmed <= 4095;
    this.setState({
      vlanTags: {
        ...this.state.vlanTags,
        validateStatus: result ? 'success' : 'error',
        errorMsg: result ? '' : <FormattedMessage id="network.hint.VLANTag" />
      }
    });
    return result;
  };

  protected handleRawFieldChange = (
    field: keyof FormField<Network.NetworkFields>,
    e: React.FormEvent<HTMLInputElement>
  ) => {
    const { value } = e.currentTarget;
    const changed = {};
    changed[field] = { ...this.state[field], value };
    this.setState(changed);
  };

  protected handleFieldChange = (
    field: keyof FormField<Network.NetworkFields>,
    value: any
  ) => {
    const changed = {};
    changed[field] = { ...this.state[field], value };
    this.setState(changed);
  };

  protected handleTagsChange = (values: Array<React.ReactText>) => {
    console.log(values.map(value => +value));
    this.setState({
      vlanTags: {
        ...this.state.vlanTags,
        value: values.map(value => +value)
      }
    });
  };

  protected handleNodesChange = (index: number) => (newValue: string) => {
    const { nodes } = this.state;
    const node = { ...nodes.value[index], name: newValue };
    const value = nodes.value.map((item, idx) => (idx === index ? node : item));

    this.setState({
      nodes: {
        ...nodes,
        value
      }
    });
  };

  protected handleInterfacesChange = (index: number) => (
    newValue: Array<string>
  ) => {
    const { nodes } = this.state;
    const nodeName = nodes.value[index].name;
    const node = {
      ...nodes.value[index],
      physicalInterfaces: newValue.map(name => ({
        name,
        pciID: this.props.nodes[nodeName].nics[name].pciID
      }))
    };
    const value = nodes.value.map((item, idx) => (idx === index ? node : item));

    this.setState({
      nodes: {
        ...nodes,
        value
      }
    });
  };

  protected handleTypeChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    const { type, isDPDKPort } = this.state;
    if (value === Network.dataPathType.system) {
      this.setState({
        type: {
          ...type,
          value: Network.dataPathType.system
        },
        isDPDKPort: {
          ...isDPDKPort,
          value: false
        }
      });
    } else {
      this.setState({
        type: {
          ...type,
          value: Network.dataPathType.netdev
        },
        isDPDKPort: {
          ...isDPDKPort,
          value: value === 'dpdk'
        }
      });
    }
  };

  protected handleMoreNodeClick = () => {
    const { nodes } = this.state;
    this.setState({
      nodes: {
        ...nodes,
        value: [...nodes.value, this.nodeFactory()]
      }
    });
  };

  protected handleNodeDelete = (index: number) => {
    const { nodes } = this.state;
    this.setState({
      nodes: {
        ...nodes,
        value: nodes.value.filter((_, idx) => idx !== index)
      }
    });
  };

  public handleSubmit = () => {
    const data = this.getFlatFormFieldValue();

    this.props.onSubmit(data);
  };

  public handleClose = () => {
    this.setState(this.stateFactory());
    this.props.onCancel();
  };

  public renderNodes = () => {
    const { nodes } = this.props;
    return this.state.nodes.value.map((node, idx) => {
      return (
        <div key={idx} className={styles.node}>
          {idx !== 0 && (
            <a
              href="javascript:void(0);"
              className={styles.delete}
              onClick={() => this.handleNodeDelete(idx)}
            >
              <Icon type="cross" />
            </a>
          )}
          <InputGroup compact={true} className={styles.selectGroup}>
            <Select
              value={node.name === '' ? undefined : node.name}
              onChange={this.handleNodesChange(idx)}
              style={{ width: '30%' }}
              placeholder={<FormattedMessage id="network.hint.selectNode" />}
            >
              {this.getAvailableNodeList(idx).map(nodeName => (
                <Option value={nodeName} key={nodeName}>
                  {nodeName}
                </Option>
              ))}
            </Select>
            <Select
              mode="multiple"
              onChange={this.handleInterfacesChange(idx)}
              style={{ width: '70%' }}
              placeholder={
                <FormattedMessage id="network.hint.selectInterfaces" />
              }
            >
              {this.getInterfaces(this.state.nodes.value[idx].name).map(
                item => (
                  <Option key={item.name}>
                    {this.state.isDPDKPort.value ? item.pciID : item.name}
                  </Option>
                )
              )}
            </Select>
          </InputGroup>
        </div>
      );
    });
  };

  public render() {
    const { nodes, visible, isLoading } = this.props;

    return (
      <Modal
        visible={visible}
        destroyOnClose={true}
        wrapClassName={styles.modal}
        onCancel={this.handleClose}
        title={<FormattedMessage id="network.form.createNewNetwork" />}
        footer={[
          <Button key="cancel" onClick={this.handleClose}>
            <FormattedMessage id="action.cancel" />
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isLoading}
            onClick={this.handleSubmit}
          >
            <FormattedMessage id="action.create" />
          </Button>
        ]}
      >
        <Form>
          <FormItem
            label={<FormattedMessage id="network.name" />}
            required={true}
            validateStatus={this.state.name.validateStatus}
            help={this.state.name.errorMsg}
          >
            <FormattedMessage id="network.hint.enterNetworkName">
              {(placeholder: string) => (
                <Input
                  value={this.state.name.value}
                  onChange={this.handleRawFieldChange.bind(this, 'name')}
                  onBlur={this.checkRequired.bind(this, 'name')}
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
          </FormItem>
          <FormItem
            label={<FormattedMessage id="network.type" />}
            required={true}
          >
            <RadioGroup
              buttonStyle="solid"
              value={this.getTypeRadioValue()}
              onChange={this.handleTypeChange}
            >
              <RadioButton value="system">System</RadioButton>
              <RadioButton value="netdev">Netdev</RadioButton>
              <RadioButton value="dpdk">Netdev with DPDK</RadioButton>
            </RadioGroup>
          </FormItem>

          <FormItem
            label={<FormattedMessage id="network.form.nodesWithInterface" />}
            required={true}
            validateStatus={this.state.nodes.validateStatus}
            help={this.state.nodes.errorMsg}
          >
            {this.renderNodes()}
            {this.state.nodes.value.length < Object.keys(nodes).length && (
              <Button
                type="dashed"
                style={{ width: '100%' }}
                onClick={this.handleMoreNodeClick}
              >
                <Icon type="plus" />
                <FormattedMessage id="network.form.addMoreNode" />
              </Button>
            )}
          </FormItem>
          <FormItem
            className={styles['last-form-item']}
            label={<FormattedMessage id="network.vlanTags" />}
            validateStatus={this.state.vlanTags.validateStatus}
            help={this.state.vlanTags.errorMsg}
          >
            <EditableTagGroup
              tags={this.state.vlanTags.value}
              canRemoveAll={true}
              onChange={this.handleTagsChange}
              validator={this.checkVLANTag}
              addMessage={<FormattedMessage id="network.newTag" />}
            />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default NetworkForm;
