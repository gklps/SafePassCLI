import inquirer from 'inquirer';
import chalk from 'chalk';
import { showBanner, showCommand } from '../utils/ui.js';
import { getUserDID } from '../utils/auth.js';
import {
  createUser, login, logout, switchUserAccount, listUserAccounts,
  createWallet, getBalance, transferRBT, getDID, registerDID, setupQuorum, addPeer,
  createFT, transferFT, getAllFTs, getFTChain,
  createNFT, subscribeNFT, deployNFT, executeNFT, getNFT, getNFTChain, getAllNFTs,
  generateSmartContract, deploySmartContract, executeSmartContract, subscribeSmartContract
} from './index.js';

const mainMenuChoices = [
  {
    name: '👤 User Management',
    value: 'user',
    command: 'safepass user'
  },
  {
    name: '💰 Wallet Operations',
    value: 'wallet',
    command: 'safepass wallet'
  },
  {
    name: '🪙 Fungible Tokens',
    value: 'ft',
    command: 'safepass ft'
  },
  {
    name: '🎨 NFT Operations',
    value: 'nft',
    command: 'safepass nft'
  },
  {
    name: '📜 Smart Contracts',
    value: 'contract',
    command: 'safepass contract'
  },
  {
    name: '❌ Exit',
    value: 'exit'
  }
];

const subMenus = {
  user: [
    { name: '📝 Register New Account', value: 'register', command: 'safepass user register' },
    { name: '🔑 Login', value: 'login', command: 'safepass user login' },
    { name: '📋 List Accounts', value: 'list', command: 'safepass user list' },
    { name: '🔄 Switch Account', value: 'switch', command: 'safepass user switch <email>' },
    { name: '🚪 Logout', value: 'logout', command: 'safepass user logout' },
    { name: '⬅️ Back to Main Menu', value: 'back' }
  ],
  wallet: [
    { name: '➕ Create New Wallet', value: 'create', command: 'safepass wallet create' },
    { name: '💳 Check Balance', value: 'balance', command: 'safepass wallet balance' },
    { name: '📤 Send RBT', value: 'send', command: 'safepass wallet send --to <did> --amount <amount>' },
    { name: '📥 Receive RBT', value: 'receive', command: 'safepass wallet receive' },
    { name: '🔑 Register DID', value: 'register-did', command: 'safepass wallet register-did' },
    { name: '⚙️ Setup Quorum', value: 'setup-quorum', command: 'safepass wallet setup-quorum' },
    { name: '👥 Add Peer', value: 'add-peer', command: 'safepass wallet add-peer --peer-did <did> --did-type <type> --peer-id <id>' },
    { name: '⬅️ Back to Main Menu', value: 'back' }
  ],
  ft: [
    { name: '➕ Create Token', value: 'create', command: 'safepass ft create --name <name> --count <count> --tokens <tokens>' },
    { name: '📤 Transfer Token', value: 'transfer', command: 'safepass ft transfer --to <did> --name <name> --count <count>' },
    { name: '📋 List All Tokens', value: 'list', command: 'safepass ft list' },
    { name: '📜 View Token History', value: 'history', command: 'safepass ft history --token-id <tokenId>' },
    { name: '⬅️ Back to Main Menu', value: 'back' }
  ],
  nft: [
    { name: '🎨 Create NFT', value: 'create', command: 'safepass nft create --metadata <path> --artifact <path>' },
    { name: '🚀 Deploy NFT', value: 'deploy', command: 'safepass nft deploy --nft <nftId> --quorum-type <type>' },
    { name: '📤 Transfer NFT', value: 'transfer', command: 'safepass nft transfer --to <did> --nft <nftId> --quorum-type <type>' },
    { name: '📋 List All NFTs', value: 'list', command: 'safepass nft list' },
    { name: 'ℹ️ NFT Info', value: 'info', command: 'safepass nft info --nft <nftId>' },
    { name: '📜 View NFT History', value: 'history', command: 'safepass nft history --nft <nftId>' },
    { name: '🔔 Subscribe to NFT', value: 'subscribe', command: 'safepass nft subscribe --nft <nftId>' },
    { name: '⬅️ Back to Main Menu', value: 'back' }
  ],
  contract: [
    { name: '📝 Create Contract', value: 'create', command: 'safepass contract create --binary <path> --raw <path> --schema <path>' },
    { name: '🚀 Deploy Contract', value: 'deploy', command: 'safepass contract deploy --token <tokenId> --quorum-type <type> --amount <amount>' },
    { name: '▶️ Execute Contract', value: 'execute', command: 'safepass contract execute --token <tokenId> --quorum-type <type>' },
    { name: '🔔 Subscribe to Contract', value: 'subscribe', command: 'safepass contract subscribe --token <tokenId>' },
    { name: '⬅️ Back to Main Menu', value: 'back' }
  ]
};

function getCommandString(command, action, options = {}) {
  const menuItem = subMenus[command]?.find(item => item.value === action);
  if (!menuItem?.command) return null;

  let cmdStr = menuItem.command;
  
  // Replace placeholders with actual values if provided
  if (options) {
    Object.entries(options).forEach(([key, value]) => {
      cmdStr = cmdStr.replace(`<${key}>`, value);
    });
  }
  
  return cmdStr;
}

async function getCommandOptions(command, action) {
  const options = {};

  switch (`${command}:${action}`) {
    case 'wallet:send':
      const sendAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'to',
          message: 'Enter receiver\'s DID:',
          validate: input => input.length > 0 || 'Receiver\'s DID is required'
        },
        {
          type: 'number',
          name: 'amount',
          message: 'Enter amount to send:',
          validate: input => input > 0 || 'Amount must be greater than 0'
        }
      ]);
      return sendAnswers;

    case 'wallet:add-peer':
      const peerAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'peerDid',
          message: 'Enter peer DID:',
          validate: input => input.length > 0 || 'Peer DID is required'
        },
        {
          type: 'number',
          name: 'didType',
          message: 'Enter DID type (0-4):',
          validate: input => input >= 0 && input <= 4 || 'DID type must be between 0 and 4'
        },
        {
          type: 'input',
          name: 'peerId',
          message: 'Enter peer ID:',
          validate: input => input.length > 0 || 'Peer ID is required'
        }
      ]);
      return peerAnswers;

    case 'ft:create':
      const ftAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter token name:',
          validate: input => input.length > 0 || 'Token name is required'
        },
        {
          type: 'number',
          name: 'count',
          message: 'Enter number of tokens to create:',
          validate: input => input > 0 || 'Token count must be greater than 0'
        },
        {
          type: 'number',
          name: 'tokens',
          message: 'Enter number of RBT tokens:',
          validate: input => input > 0 || 'RBT tokens must be greater than 0'
        }
      ]);
      return ftAnswers;

    default:
      return options;
  }
}

async function executeCommand(command, action, options = {}) {
  const cmdStr = getCommandString(command, action, options);
  if (cmdStr) {
    showCommand(cmdStr, options);
  }

  switch (`${command}:${action}`) {
    case 'user:register':
      return createUser();
    case 'user:login':
      return login();
    case 'user:logout':
      return logout();
    case 'user:list':
      return listUserAccounts();
    case 'user:switch':
      return switchUserAccount(options.email);
      
    case 'wallet:create':
      return createWallet();
    case 'wallet:balance':
      return getBalance();
    case 'wallet:send':
      return transferRBT(options);
    case 'wallet:receive':
      return getDID();
    case 'wallet:register-did':
      return registerDID();
    case 'wallet:setup-quorum':
      return setupQuorum();
    case 'wallet:add-peer':
      return addPeer(options);
      
    case 'ft:create':
      return createFT(options);
    case 'ft:transfer':
      return transferFT(options);
    case 'ft:list':
      return getAllFTs();
    case 'ft:history':
      return getFTChain(options);
      
    default:
      console.log(chalk.yellow(`\nCommand not implemented yet: ${command} ${action}`));
      if (cmdStr) {
        showCommand(cmdStr, options);
      }
  }
}

export default async function showMenu() {
  let currentMenu = 'main';
  let running = true;

  while (running) {
    showBanner();
    
    const did = getUserDID();
    if (did) {
      console.log(chalk.green(`\nLogged in as: ${did}`));
    }

    let choices;
    let message;

    if (currentMenu === 'main') {
      choices = mainMenuChoices;
      message = 'Select an operation:';
    } else {
      choices = subMenus[currentMenu];
      message = `Select ${currentMenu.toUpperCase()} operation:`;
    }

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: message,
        choices: choices,
        pageSize: 10
      }
    ]);

    if (action === 'exit') {
      running = false;
      console.clear();
      continue;
    }

    if (action === 'back') {
      currentMenu = 'main';
      continue;
    }

    if (currentMenu === 'main') {
      currentMenu = action;
      continue;
    }

    const options = await getCommandOptions(currentMenu, action);
    await executeCommand(currentMenu, action, options);
    
    const { continue: shouldContinue } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: 'Would you like to perform another operation?',
        default: true
      }
    ]);

    if (!shouldContinue) {
      running = false;
      console.clear();
    }
  }
}