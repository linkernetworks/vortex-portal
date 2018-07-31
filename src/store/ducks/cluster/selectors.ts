import { pickBy } from 'lodash';
import { ClusterStateType, clusterModels } from './index';

export const getNodesWithPhysicalInterfaces = (duck: ClusterStateType) => {
  const { nodes, allNodes } = duck;
  return allNodes.reduce((filteredNodes, nodeName) => {
    const node = nodes[nodeName];
    const nics = pickBy(
      node.nics,
      (_, key) => node.nics[key].type === clusterModels.NICType.physical
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
