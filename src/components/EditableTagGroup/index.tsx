import * as React from 'react';
import { Tag, Input, Tooltip, Icon } from 'antd';

interface EditableTagGroupState {
  tags: Array<React.ReactText>;
  inputVisible: boolean;
  inputValue: string;
}

class EditableTagGroup extends React.PureComponent<
  object,
  EditableTagGroupState
> {
  private input: React.RefObject<Input>;

  constructor(props: object) {
    super(props);
    this.input = React.createRef();
    this.state = {
      tags: [],
      inputVisible: false,
      inputValue: ''
    };
  }

  protected showInput = () => {
    this.setState(
      { inputVisible: true },
      () => this.input.current && this.input.current.focus()
    );
  };

  protected handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.currentTarget.value });
  };

  protected handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: ''
    });
  };

  protected handleClose = (removedTag: string) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  public render() {
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <div>
        {inputVisible && (
          <Input
            ref={this.input}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{ background: '#fff', borderStyle: 'dashed' }}
          >
            <Icon type="plus" /> New Tag
          </Tag>
        )}
      </div>
    );
  }
}

export default EditableTagGroup;
