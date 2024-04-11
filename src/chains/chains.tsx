import Chain from '../models/chains'


export const calibrationFilecoin: Chain = {
  id: '0x4cb2f',
  token: 'TFIL',
  shortName: 'cal',
  label: 'Filecoin Calibration',
  rpcUrl: 'https://api.calibration.node.glif.io/rpc/v1',
  blockExplorerUrl: 'https://calibration.filfox.info/en',
  color: '#3e6957',
  isStripePaymentsEnabled: false,
  icon:"/images/chains/filecoin.png"
}

export const ArbitrumSepolia: Chain = {
    id: '0x66EEE',
    token: 'ETH',
    shortName: 'arb',
    label: 'Arbitrum Sepolia',
    rpcUrl: 'https://arbitrum-sepolia.blockpi.network/v1/rpc/public ',
    blockExplorerUrl: 'https://sepolia-explorer.arbitrum.io',
    color: '#3e6957',
    isStripePaymentsEnabled: false,
    icon:"/images/chains/arbitrum.png"
  }
  

  export const GnosisChain: Chain = {
    id: '0x27d8',
    token: 'XDAI',
    shortName: 'chiado',
    label: 'Gnosis Chiado Testnet',
    rpcUrl: 'https://rpc.chiadochain.net',
    blockExplorerUrl: 'https://blockscout.chiadochain.net',
    color: '#3e6957',
    isStripePaymentsEnabled: false,
    icon:"/images/chains/gnosis.png"
  }

  export const MorphTestnet: Chain = {
    id: '0xa96',
    token: 'ETH',
    shortName: 'morph',
    label: 'Morph Testnet',
    rpcUrl: 'https://rpc-testnet.morphl2.io',
    blockExplorerUrl: 'https://explorer-testnet.morphl2.io',
    color: '#3e6957',
    isStripePaymentsEnabled: false,
    icon:"/images/chains/morph.jpg"
  }


  export const NeonDevnet: Chain = {
    id: '0xe9ac0ce',
    token: 'NEON',
    shortName: 'neon',
    label: 'Neon EVM Devnet',
    rpcUrl: 'https://devnet.neonevm.org',
    blockExplorerUrl: 'https://devnet.neonscan.org',
    color: '#3e6957',
    isStripePaymentsEnabled: false,
    icon:"/images/chains/neon.webp"
  }

  
const chains: Chain[] = [calibrationFilecoin,ArbitrumSepolia,GnosisChain,MorphTestnet,NeonDevnet]

export const chainMap = new Map([[calibrationFilecoin.id,0],[ArbitrumSepolia.id,1],[GnosisChain.id,2],[MorphTestnet.id,3],[NeonDevnet.id,4]])


export const initialChain = calibrationFilecoin

export default chains