import { pickBy } from 'lodash';
import { ClusterStateType, clusterModels } from './index';

export const getNodesWithPhysicalInterfaces = (duck: ClusterStateType) => {
  const { nodes, allNodes } = duck;
  return allNodes.reduce((filteredNodes, nodeName) => {
    const node = nodes[nodeName];
    const nics = pickBy(
      node.nics,
      (_, key) =>
        node.nics[key].type === clusterModels.NICType.physical &&
        !node.nics[key].default // default means used by cluster flannel network interface
    );
    return {
      ...filteredNodes,
      [nodeName]: {
        ...node,
        nics
      }
    };
  }, {});
};

export const getAllPodsInAvailableNamespace = (duck: ClusterStateType) => {
  const { pods, allPods } = duck;
  return allPods.filter(podName => {
    const pod = pods[podName];
    return pod.namespace !== 'vortex' && pod.namespace !== 'kube-system';
  });
};

export const getPodsInAvailableNamespace = (duck: ClusterStateType) => {
  const { pods } = duck;
  const filteredPods = pickBy(
    pods,
    (_, key) =>
      pods[key].namespace !== 'vortex' && pods[key].namespace !== 'kube-system'
  );
  return filteredPods;
};
