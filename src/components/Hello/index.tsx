import * as React from 'react';
import * as styles from './styles.module.scss';

console.log(styles);

export interface Props {
  name: string;
  enthusiasmLevel?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

class Hello extends React.Component<Props, object> {
  public getExclamationMarks(numChars: number) {
    return Array(numChars + 1).join('!');
  }

  public render() {
    const { name, enthusiasmLevel = 1, onDecrement, onIncrement } = this.props;

    if (enthusiasmLevel <= 0) {
      throw new Error('You coul d be a little more enthusiastic. :D');
    }

    return (
      <div className={styles.hello}>
        <div className="greeting">
          Hello {name + this.getExclamationMarks(enthusiasmLevel)}
        </div>
        <div>
          <button onClick={onDecrement}>-</button>
          <button onClick={onIncrement}>+</button>
        </div>
      </div>
    );
  }
}

export default Hello;
