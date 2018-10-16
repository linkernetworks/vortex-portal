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

export const getAllDeploymentsInAvailableNamespace = (
  duck: ClusterStateType
) => {
  const { deployments, allDeployments } = duck;
  return allDeployments.filter(deploymentName => {
    const deployment = deployments[deploymentName];
    return (
      deployment.namespace !== 'vortex' &&
      deployment.namespace !== 'kube-system'
    );
  });
};

export const getDeploymentsInAvailableNamespace = (duck: ClusterStateType) => {
  const { deployments } = duck;
  const filteredPods = pickBy(
    deployments,
    (_, key) =>
      deployments[key].namespace !== 'vortex' &&
      deployments[key].namespace !== 'kube-system'
  );
  return filteredPods;
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

export const getConfigmaps = (duck: ClusterStateType) => {
  const { configmaps } = duck;
  const mapConfigmaps = configmaps.reduce(function(map, obj) {
    map[obj.name] = obj;
    return map;
  }, {});
  return mapConfigmaps;
};
