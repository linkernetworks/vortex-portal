import { createAction, ActionType } from 'typesafe-actions';

// export const fetchNodes = createAsyncAction(
//   'FETCH_NODES_REQUEST',
//   'FETCH_NODES_SUCCESS',
//   'FETCH_NODES_FAILURE'
// )<void, Array<string>, Error>();

export const fetchNodesSuccess = createAction(
  'FETCH_NODES_SUCCESS',
  resolve => {
    return (payload: { nodes: Array<string> }) => resolve(payload);
  }
);
