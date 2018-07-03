import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { default as Hello, Props } from '@/components/Hello';
import { enthusiasmActions } from '@/store/ducks/enthusiasm';
import { RootState, RootAction } from '@/store/ducks';

const mapStateToProps = (state: RootState) => {
  return {
    name: state.enthusiasm.languageName,
    enthusiasmLevel: state.enthusiasm.enthusiasmLevel
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  onIncrement: () => dispatch(enthusiasmActions.incrementEnthusiasm()),
  onDecrement: () => dispatch(enthusiasmActions.decrementEnthusiasm())
});

export default connect<Props>(
  mapStateToProps,
  mapDispatchToProps
)(Hello);
