import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { map, isEmpty } from 'lodash';
import { Form, Button, Icon, Select, Input, Radio } from 'antd';
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
  nodes: Node.Nodes;
}

interface NetworkFormState extends FormField<Network.NetworkFields> {}

class NetworkForm extends React.PureComponent<
  NetworkFormProps,
  NetworkFormState
> {
  constructor(props: NetworkFormProps) {
    super(props);
    this.state = {
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
      VLANTags: {
        value: []
      }
    };
  }

  protected nodeFactory = () => {
    return {
      name: '',
      physicalInterface: []
    };
  };

  protected getFlatFormFieldValue = () => {
    return this.state;
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
    const { nodes } = this.props;
    return nodeName === ''
      ? []
      : map(nodes[nodeName].nics, (item, key) => {
          return {
            name: key,
            pciID: item.pciID
          };
        });
  };

  protected getAvailableNodeList = (selfIdx: number) => {
    const { nodes } = this.props;
    const self = this.state.nodes.value[selfIdx].name;
    const usedList = this.state.nodes.value.map(node => node.name);
    return Object.keys(nodes).filter(
      node => self === node || usedList.indexOf(node) === -1
    );
  };

  protected checkRequired = (field: keyof NetworkFormState) => {
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
      VLANTags: {
        ...this.state.VLANTags,
        validateStatus: result ? 'success' : 'error',
        errorMsg: result ? '' : <FormattedMessage id="network.hint.VLANTag" />
      }
    });
    return result;
  };

  protected handleRawFieldChange = (
    field: keyof NetworkFormState,
    e: React.FormEvent<HTMLInputElement>
  ) => {
    const { value } = e.currentTarget;
    const changed = {};
    changed[field] = { ...this.state[field], value };
    this.setState(changed);
  };

  protected handleFieldChange = (field: keyof NetworkFormState, value: any) => {
    const changed = {};
    changed[field] = { ...this.state[field], value };
    this.setState(changed);
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
    return;
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
    const { nodes } = this.props;

    return (
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
          label={<FormattedMessage id="network.VLANTag" />}
          validateStatus={this.state.VLANTags.validateStatus}
          help={this.state.VLANTags.errorMsg}
        >
          <EditableTagGroup
            tags={this.state.VLANTags.value}
            onChange={this.handleFieldChange.bind(this, 'VLANTags')}
            validator={this.checkVLANTag}
            addMessage={<FormattedMessage id="network.newTag" />}
          />
        </FormItem>
      </Form>
    );
  }
}

export default NetworkForm;
