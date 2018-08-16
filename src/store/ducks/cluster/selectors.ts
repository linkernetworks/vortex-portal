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
