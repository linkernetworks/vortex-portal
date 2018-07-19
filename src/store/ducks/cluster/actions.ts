import { createAsyncAction } from 'typesafe-actions';
import * as Node from '@/models/Node';

export const fetchNodes = createAsyncAction(
  'FETCH_NODES_REQUEST',
  'FETCH_NODES_SUCCESS',
  'FETCH_NODES_FAILURE'
)<void, Array<string>, Error>();

export const fetchNodeNICs = createAsyncAction(
  'FETCH_NICS_REQUEST',
  'FETCH_NICS_SUCCESS',
  'FETCH_NICS_FAILURE'
)<
  void,
  {
    [node: string]: Array<Node.NetworkInterfaceController>;
  },
  Error
>();
