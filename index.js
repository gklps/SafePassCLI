#!/usr/bin/env node

import { program } from 'commander';
import showMenu from './commands/menu.js';
import {
  createUser, login, getBalance, transferRBT,
  createWallet, logout, getDID, registerDID, setupQuorum, addPeer,
  createFT, transferFT, getAllFTs, getFTChain,
  createNFT, subscribeNFT, deployNFT, executeNFT, getNFT, getNFTChain, getAllNFTs,
  generateSmartContract, deploySmartContract, executeSmartContract, subscribeSmartContract,
  switchUserAccount, listUserAccounts
} from './commands/index.js';

program
  .name('safepass')
  .description('SafePass CLI')
  .version('1.0.4')
  .action(() => {
    showMenu();
  });

// User Commands
const user = program.command('user')
  .description('User account management');

user
  .command('register')
  .description('Create a new Rubix wallet account')
  .action(createUser);

user
  .command('login')
  .description('Log in to your Rubix wallet account')
  .action(login);

user
  .command('logout')
  .description('Log out from your wallet account')
  .action(logout);

user
  .command('list')
  .description('List all registered accounts')
  .action(listUserAccounts);

user
  .command('switch')
  .description('Switch to a different account')
  .argument('<email>', 'Email of the account to switch to')
  .action(switchUserAccount);

// Wallet Commands
const wallet = program.command('wallet')
  .description('Wallet operations');

wallet
  .command('create')
  .description('Create a new wallet')
  .action(createWallet);

wallet
  .command('register-did')
  .description('Register your DID')
  .action(registerDID);

wallet
  .command('setup-quorum')
  .description('Setup quorum for your wallet')
  .action(setupQuorum);

wallet
  .command('add-peer')
  .description('Add a peer to your wallet')
  .requiredOption('--peer-did <did>', 'Peer DID')
  .requiredOption('--did-type <type>', 'DID Type (0-4)')
  .requiredOption('--peer-id <id>', 'Peer ID')
  .action(addPeer);

wallet
  .command('balance')
  .description('Display your current wallet balance')
  .action(getBalance);

wallet
  .command('receive')
  .description('Show your wallet DID for receiving tokens')
  .action(getDID);

wallet
  .command('send')
  .description('Send RBT tokens to another wallet')
  .requiredOption('--to <did>', 'Receiver\'s DID')
  .requiredOption('--amount <amount>', 'Amount of RBT to send')
  .action(transferRBT);

// Fungible Token Commands
const ft = program.command('ft')
  .description('Fungible Token operations');

ft
  .command('create')
  .description('Create new Fungible Tokens')
  .requiredOption('--name <name>', 'Token name')
  .requiredOption('--count <count>', 'Number of tokens to create')
  .requiredOption('--tokens <tokens>', 'Number of RBT tokens')
  .action(createFT);

ft
  .command('transfer')
  .description('Transfer Fungible Tokens')
  .requiredOption('--to <did>', 'Receiver\'s DID')
  .requiredOption('--name <name>', 'Token name')
  .requiredOption('--count <count>', 'Number of tokens to transfer')
  .action(transferFT);

ft
  .command('list')
  .description('List all Fungible Tokens')
  .action(getAllFTs);

ft
  .command('history')
  .description('Get token transaction history')
  .requiredOption('--token-id <tokenId>', 'Token ID')
  .action(getFTChain);

// NFT Commands
const nft = program.command('nft')
  .description('Non-Fungible Token operations');

nft
  .command('create')
  .description('Create new NFT')
  .requiredOption('--metadata <path>', 'Path to metadata file')
  .requiredOption('--artifact <path>', 'Path to artifact file')
  .action(createNFT);

nft
  .command('deploy')
  .description('Deploy NFT')
  .requiredOption('--nft <nftId>', 'NFT ID')
  .requiredOption('--quorum-type <type>', 'Quorum type (1 or 2)')
  .action(deployNFT);

nft
  .command('transfer')
  .description('Transfer NFT')
  .requiredOption('--to <did>', 'Receiver\'s DID')
  .requiredOption('--nft <nftId>', 'NFT ID')
  .requiredOption('--quorum-type <type>', 'Quorum type (1 or 2)')
  .option('--comment <text>', 'Transaction comment')
  .option('--data <data>', 'NFT data')
  .option('--value <amount>', 'NFT value')
  .action(executeNFT);

nft
  .command('list')
  .description('List all NFTs')
  .action(getAllNFTs);

nft
  .command('info')
  .description('Get NFT details')
  .requiredOption('--nft <nftId>', 'NFT ID')
  .action(getNFT);

nft
  .command('history')
  .description('Get NFT transaction history')
  .requiredOption('--nft <nftId>', 'NFT ID')
  .option('--latest', 'Get only latest transaction')
  .action(getNFTChain);

nft
  .command('subscribe')
  .description('Subscribe to NFT updates')
  .requiredOption('--nft <nftId>', 'NFT ID')
  .action(subscribeNFT);

// Smart Contract Commands
const contract = program.command('contract')
  .description('Smart Contract operations');

contract
  .command('create')
  .description('Generate Smart Contract')
  .requiredOption('--binary <path>', 'Path to binary code file')
  .requiredOption('--raw <path>', 'Path to raw code file')
  .requiredOption('--schema <path>', 'Path to schema file')
  .action(generateSmartContract);

contract
  .command('deploy')
  .description('Deploy Smart Contract')
  .requiredOption('--token <tokenId>', 'Smart Contract Token')
  .requiredOption('--quorum-type <type>', 'Quorum type (1 or 2)')
  .requiredOption('--amount <amount>', 'RBT amount')
  .option('--comment <text>', 'Deployment comment')
  .action(deploySmartContract);

contract
  .command('execute')
  .description('Execute Smart Contract')
  .requiredOption('--token <tokenId>', 'Smart Contract Token')
  .requiredOption('--quorum-type <type>', 'Quorum type (1 or 2)')
  .option('--data <data>', 'Smart Contract data')
  .option('--comment <text>', 'Execution comment')
  .action(executeSmartContract);

contract
  .command('subscribe')
  .description('Subscribe to Smart Contract updates')
  .requiredOption('--token <tokenId>', 'Smart Contract Token')
  .action(subscribeSmartContract);

program.parse();