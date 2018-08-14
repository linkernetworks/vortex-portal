import { createAsyncAction } from 'typesafe-actions';
import * as Node from '@/models/Node';
import * as Pod from '@/models/Pod';
import * as Container from '@/models/Container';
import * as Service from '@/models/Service';

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

export const fetchPod = createAsyncAction(
  'FETCH_POD_REQUEST',
  'FETCH_POD_SUCCESS',
  'FETCH_POD_FAILURE'
)<void, Pod.Pod, Error>();

export const fetchPods = createAsyncAction(
  'FETCH_PODS_REQUEST',
  'FETCH_PODS_SUCCESS',
  'FETCH_PODS_FAILURE'
)<void, Pod.Pods, Error>();

export const fetchContainers = createAsyncAction(
  'FETCH_CONTAINERS_REQUEST',
  'FETCH_CONTAINERS_SUCCESS',
  'FETCH_CONTAINERS_FAILURE'
)<void, Container.Containers, Error>();

export const fetchContainer = createAsyncAction(
  'FETCH_CONTAINER_REQUEST',
  'FETCH_CONTAINER_SUCCESS',
  'FETCH_CONTAINER_FAILURE'
)<void, Container.Container, Error>();

export const addPod = createAsyncAction(
  'ADD_POD_REQUEST',
  'ADD_POD_SUCCESS',
  'ADD_POD_FAILURE'
)<void, Pod.PodRequest, Error>();

export const fetchServices = createAsyncAction(
  'FETCH_SERVICES_REQUEST',
  'FETCH_SERVICES_SUCCESS',
  'FETCH_SERVICES_FAILURE'
)<void, Array<Service.Service>, Error>();

export const addService = createAsyncAction(
  'ADD_SERVICE_REQUEST',
  'ADD_SERVICE_SUCCESS',
  'ADD_SERVICE_FAILURE'
)<void, Service.Service, Error>();

export const removeService = createAsyncAction(
  'REMOVE_SERVICE_REQUEST',
  'REMOVE_SERVICE_SUCCESS',
  'REMOVE_SERVICE_FAILURE'
)<void, { id: string }, Error>();
