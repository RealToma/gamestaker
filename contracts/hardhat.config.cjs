
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@openzeppelin/hardhat-upgrades';
import 'solidity-coverage';

import './contracts/scripts/tasks/index';



require('dotenv').config();


const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY; 
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGON_SCAN_API_KEY =  process.env.POLYGON_SCAN_API_KEY;
const CELO_SCAN_API_KEY = process.env.CELO_SCAN_API_KEY;
const BSC_API_KEY=process.env.BSC_API_KEY;

// Private keys for the deployments for the NFTicket demo on Polygon Mumbai
const MASTER_PRIVATE_KEY = process.env.MASTER_PRIVATE_KEY;
const SERVICE_PROVIDER_PRIVATE_KEY = process.env.SERVICE_PROVIDER_PRIVATE_KEY;
const RESELLER_PRIVATE_KEY = process.env.RESELLER_PRIVATE_KEY;
const BE_PRIVATE_KEY = process.env.BE_PRIVATE_KEY;
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'hardhat',
  typechain: {
    outDir: "./typechain-types",
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: ['externalArtifacts/*.json'], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
    dontOverrideCompile: false // defaults to false
  },
  paths: {
    sources: ".",
    tests: "./scripts/test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  abiExporter: {
    path: process.env.CONTRACT_ABI_PATH,
    runOnCompile: true,
    clear: true,
    flat: true,
    spacing: 2,
  },

  networks: {
    hardhat: {
      chainId: 1337,
    },
    local: {
      url: `http://localhost:8545/`,
      accounts: [`0x${MASTER_PRIVATE_KEY}`, `0x${SERVICE_PROVIDER_PRIVATE_KEY}`, `0x${RESELLER_PRIVATE_KEY}`],
    },
    // polygon smart chain
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${MASTER_PRIVATE_KEY}`, `0x${SERVICE_PROVIDER_PRIVATE_KEY}`, `0x${RESELLER_PRIVATE_KEY}`],
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${MASTER_PRIVATE_KEY}`, `0x${SERVICE_PROVIDER_PRIVATE_KEY}`, `0x${RESELLER_PRIVATE_KEY}`],
    },
    // ethereum smart chain
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${MASTER_PRIVATE_KEY}`, `0x${SERVICE_PROVIDER_PRIVATE_KEY}`, `0x${RESELLER_PRIVATE_KEY}`],
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [`0x${MASTER_PRIVATE_KEY}`, `0x${SERVICE_PROVIDER_PRIVATE_KEY}`, `0x${RESELLER_PRIVATE_KEY}`],
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${MASTER_PRIVATE_KEY}`, `0x${SERVICE_PROVIDER_PRIVATE_KEY}`, `0x${RESELLER_PRIVATE_KEY}`],
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${MASTER_PRIVATE_KEY}`, `0x${SERVICE_PROVIDER_PRIVATE_KEY}`, `0x${RESELLER_PRIVATE_KEY}`],
    },
    agung: {
      url: `https://erpc.agung.peaq.network/`,
      chainId: 9999,
      accounts: [`0x${MASTER_PRIVATE_KEY}`, `0x${SERVICE_PROVIDER_PRIVATE_KEY}`, `0x${RESELLER_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: {
      polygon: POLYGON_SCAN_API_KEY,
      polygonMumbai: POLYGON_SCAN_API_KEY,
      bscTestnet: BSC_API_KEY,
      mainnet: ETHERSCAN_API_KEY,
      rinkeby: ETHERSCAN_API_KEY,
      goerli: ETHERSCAN_API_KEY,
      celo: CELO_SCAN_API_KEY,
      alfajores: CELO_SCAN_API_KEY,
    },
    customChains: [
        {
            network: "alfajores",
            chainId: 44787,
            urls: {
                apiURL: "https://api-alfajores.celoscan.io/api",
                browserURL: "https://alfajores.celoscan.io",
            },
        },
        {
            network: "celo",
            chainId: 42220,
            urls: {
                apiURL: "https://api.celoscan.io/api",
                browserURL: "https://celoscan.io",
            },
        }
    ]
  },
  solidity: {
    version: '0.8.20',
    settings: {
      evmVersion: "berlin",
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          yul: false,
        },
      },
    },
  },
};
