import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { map } from 'lodash';
import { Form, Button, Icon, Select, Input, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';

import * as styles from './styles.module.scss';
import { Omit, FormField } from '@/utils/types';
import * as Network from '@/models/Network';
import * as Node from '@/models/Node';
import EditableTagGroup from '@/components/EditableTagGroup';
import network from '@/locales/en-US/network';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

interface NetworkFormProps {
  nodes: Node.Nodes;
}

interface NetworkFormState
  extends FormField<Omit<Network.Network, 'id' | 'createdAt' | 'bridgeName'>> {}

class NetworkForm extends React.PureComponent<
  NetworkFormProps,
  NetworkFormState
> {
  constructor(props: NetworkFormProps) {
    super(props);
    this.state = {
      name: {
        value: '',
        validateStatus: ''
      },
      type: {
        value: Network.dataPathType.system,
        validateStatus: ''
      },
      isDPDKPort: {
        value: false,
        validateStatus: ''
      },
      nodes: {
        value: [
          {
            name: '',
            physicalInterface: []
          }
        ],
        validateStatus: ''
      },
      VLANTags: {
        value: [],
        validateStatus: ''
      }
    };
  }

  protected handleRawFieldChange = (
    id: keyof NetworkFormState,
    e: React.FormEvent<HTMLInputElement>
  ) => {
    const { value } = e.currentTarget;
    const changed = {};
    changed[id] = { ...this.state[id], value };
    this.setState(changed);
  };

  protected handleFieldChange = (id: keyof NetworkFormState, value: any) => {
    const changed = {};
    changed[id] = { ...this.state[id], value };
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

  protected checkVLANTag = (value: number | string) => {
    value = +value;
    return Number.isInteger(value) && value >= 0 && value <= 4095;
  };

  public render() {
    const { nodes } = this.props;

    return (
      <Form>
        <FormItem
          label={<FormattedMessage id="network.networkName" />}
          required={true}
        >
          <Input
            value={this.state.name.value}
            onChange={this.handleRawFieldChange.bind(this, 'name')}
            placeholder="Network Name"
          />
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
          label={<FormattedMessage id="network.nodes" />}
          required={true}
        >
          {this.state.nodes.value.map((node, idx) => {
            return (
              <InputGroup key={node.name} compact={true}>
                <Select
                  value={node.name === '' ? undefined : node.name}
                  onChange={this.handleNodesChange(idx)}
                  style={{ width: '50%' }}
                  placeholder={
                    <FormattedMessage id="network.hint.selectNode" />
                  }
                >
                  {Object.keys(nodes).map(nodeName => (
                    <Option value={nodeName} key={nodeName}>
                      {nodeName}
                    </Option>
                  ))}
                </Select>
                <Select
                  mode="multiple"
                  style={{ width: '50%' }}
                  placeholder={
                    <FormattedMessage id="network.hint.selectInterface" />
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
            );
          })}
        </FormItem>
        <FormItem label={<FormattedMessage id="network.trunk" />}>
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
