import { ActionType, StateType, getType } from 'typesafe-actions';
import * as Network from './actions';
import { Network as networkModel, dataPathType } from './models';

export type NetworkStateType = StateType<typeof networkReducer>;
export type NetworkActionType = ActionType<typeof Network>;

const fixtures: Array<networkModel> = [
  {
    id: '1',
    type: dataPathType.system,
    name: 'myNetworkqweqweqweqeqweqweqweq',
    bridgeName: '46541dabfadfe',
    VLANTags: [
      100,
      260,
      950,
      0,
      1024,
      4000,
      2401,
      3120,
      2301,
      800,
      1002,
      1232,
      1111
    ],
    isDPDKPort: false,
    nodes: [
      { name: 'node 1', physicalInterface: [{ name: 'eth0', pciid: '' }] }
    ]
  },
  {
    id: '2',
    type: dataPathType.netdev,
    name: 'myNetwork',
    bridgeName: '32541dabfadfe',
    VLANTags: [100, 260, 950],
    isDPDKPort: false,
    nodes: [
      {
        name: 'node 1',
        physicalInterface: [{ name: 'eth0', pciid: '' }]
      },
      {
        name: '2eeeqweqweqweqweqwe',
        physicalInterface: [{ name: 'eth0', pciid: '' }]
      },
      { name: 'node 3', physicalInterface: [{ name: 'eth0', pciid: '' }] }
    ]
  },
  {
    id: '3',
    type: dataPathType.netdev,
    name: 'myNetwork',
    bridgeName: '32541dabfadfe',
    VLANTags: [],
    isDPDKPort: true,
    nodes: [
      {
        name: 'node 1',
        physicalInterface: [{ name: '', pciid: '0013:00:01' }]
      },
      {
        name: 'node 2',
        physicalInterface: [{ name: '', pciid: '0023:00:01' }]
      },
      {
        name: 'node 3',
        physicalInterface: [{ name: '', pciid: '0013:00:02' }]
      }
    ]
  }
];

const initialState = {
  networks: fixtures,
  isLoading: ''
};

export function networkReducer(
  state = initialState,
  action: NetworkActionType
) {
  if (state === undefined) {
    return initialState;
  }

  switch (action.type) {
    case getType(Network.addNetwork.request):
      return {
        ...state,
        isLoading: true
      };
    case getType(Network.addNetwork.success):
      return {
        ...state,
        isLoading: false,
        networks: [...state.networks, action.payload]
      };
    case getType(Network.deleteNetwork):
      return {
        ...state,
        isLoading: false,
        networks: state.networks.filter(
          record => record.id !== action.payload.id
        )
      };
    default:
      return state;
  }
}
