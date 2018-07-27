import * as React from 'react';
import { Tag, Input, Tooltip, Icon, Button } from 'antd';

interface EditableTagGroupProps {
  tags: Array<React.ReactText>;
  addMessage: React.ReactChild;
  validator: (value: React.ReactText) => boolean;
  onChange: (changedValue: any) => void;
  canRemoveAll?: boolean;
}
interface EditableTagGroupState {
  inputVisible: boolean;
  inputValue: string;
  validated: boolean;
}

class EditableTagGroup extends React.PureComponent<
  EditableTagGroupProps,
  EditableTagGroupState
> {
  private input: React.RefObject<Input>;

  public static defaultProps: Partial<EditableTagGroupProps> = {
    canRemoveAll: false
  };

  constructor(props: EditableTagGroupProps) {
    super(props);
    this.input = React.createRef();
    this.state = {
      inputVisible: false,
      inputValue: '',
      validated: false
    };
  }

  protected showInput = () => {
    this.setState(
      { inputVisible: true },
      () => this.input.current && this.input.current.focus()
    );
  };

  protected handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      inputValue: e.currentTarget.value,
      validated: this.props.validator(e.currentTarget.value)
    });
  };

  protected handleInputConfirm = () => {
    const { inputValue, validated } = this.state;
    let tags = this.props.tags;

    if (validated && inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue].sort((a, b) => +a - +b);
      this.props.onChange(tags);

      this.setState({
        inputVisible: false,
        inputValue: '',
        validated: false
      });
    }
  };

  protected handleClose = (removedTag: string) => {
    const tags = this.props.tags.filter(tag => tag !== removedTag);
    this.props.onChange(tags);
  };

  public render() {
    const { inputVisible, inputValue } = this.state;
    const { tags, addMessage, canRemoveAll } = this.props;
    return (
      <div>
        {tags.map((tag: string) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag
              key={tag}
              closable={true}
              afterClose={() => this.handleClose(tag)}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
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
            <Icon type="plus" /> {addMessage}
          </Tag>
        )}
        {canRemoveAll && tags.length !== 0 && <Button>Remove All</Button>}
      </div>
    );
  }
}

export default EditableTagGroup;
