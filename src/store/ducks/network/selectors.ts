import { mergeWith } from 'lodash';
import { NetworkStateType } from './index';

export const NodesWithUsedInterface = (duck: NetworkStateType) => {
  return duck.networks.reduce((allNodes, network) => {
    const nodesInANetwork = network.nodes.reduce((acc, node) => {
      acc[node.name] = node.physicalInterfaces.map(
        physicalInterface => physicalInterface.name
      );
      return acc;
    }, {});
    return mergeWith(allNodes, nodesInANetwork, (objValue, srcValue) => {
      return objValue ? objValue.concat(srcValue) : srcValue;
    });
  }, {});
};
