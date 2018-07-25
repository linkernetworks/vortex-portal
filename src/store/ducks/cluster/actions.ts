import { createAsyncAction } from 'typesafe-actions';
import * as Node from '@/models/Node';
import * as Pod from '@/models/Pod';

export const fetchNodes = createAsyncAction(
  'FETCH_NODES_REQUEST',
  'FETCH_NODES_SUCCESS',
  'FETCH_NODES_FAILURE'
)<void, Node.Nodes, Error>();

export const fetchNodeNICs = createAsyncAction(
  'FETCH_NICS_REQUEST',
  'FETCH_NICS_SUCCESS',
  'FETCH_NICS_FAILURE'
)<
  void,
  {
    [node: string]: Array<Node.NICBrief>;
  },
  Error
>();

export const fetchPods = createAsyncAction(
  'FETCH_PODS_REQUEST',
  'FETCH_PODS_SUCCESS',
  'FETCH_PODS_FAILURE'
)<void, Pod.Pod, Error>();
