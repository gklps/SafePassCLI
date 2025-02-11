#!/usr/bin/env node

import { program } from 'commander';
import {
  createUser, login, getBalance, transferRBT,
  createWallet, logout, getDID, registerDID, setupQuorum, addPeer,
  createFT, transferFT, getAllFTs, getFTChain,
  createNFT, subscribeNFT, deployNFT, executeNFT, getNFT, getNFTChain, getAllNFTs,
  generateSmartContract, deploySmartContract, executeSmartContract, subscribeSmartContract
} from './commands/index.js';

program
  .name('rubix-wallet')
  .description('Rubix Wallet CLI')
  .version('1.0.0');

// User Management
program
  .command('register')
  .description('Create a new Rubix wallet account')
  .action(createUser);

program
  .command('login')
  .description('Log in to your Rubix wallet account')
  .action(login);

// Wallet Operations
program
  .command('create-wallet')
  .description('Create a new wallet')
  .action(createWallet);

program
  .command('register-did')
  .description('Register your DID')
  .action(registerDID);

program
  .command('setup-quorum')
  .description('Setup quorum for your wallet')
  .action(setupQuorum);

program
  .command('add-peer')
  .description('Add a peer to your wallet')
  .requiredOption('--peer-did <did>', 'Peer DID')
  .requiredOption('--did-type <type>', 'DID Type (0-4)')
  .requiredOption('--peer-id <id>', 'Peer ID')
  .action(addPeer);

program
  .command('balance')
  .description('Display your current wallet balance')
  .action(getBalance);

program
  .command('receive')
  .description('Show your wallet DID for receiving tokens')
  .action(getDID);

program
  .command('send')
  .description('Send RBT tokens to another wallet')
  .requiredOption('--to <did>', 'Receiver\'s DID')
  .requiredOption('--amount <amount>', 'Amount of RBT to send')
  .action(transferRBT);

// Fungible Token Operations
program
  .command('ft')
  .description('Fungible Token operations')
  .addCommand(
    program.command('create')
      .description('Create new Fungible Tokens')
      .requiredOption('--name <name>', 'Token name')
      .requiredOption('--count <count>', 'Number of tokens to create')
      .requiredOption('--tokens <tokens>', 'Number of RBT tokens')
      .action(createFT)
  )
  .addCommand(
    program.command('transfer')
      .description('Transfer Fungible Tokens')
      .requiredOption('--to <did>', 'Receiver\'s DID')
      .requiredOption('--name <name>', 'Token name')
      .requiredOption('--count <count>', 'Number of tokens to transfer')
      .action(transferFT)
  )
  .addCommand(
    program.command('list')
      .description('List all Fungible Tokens')
      .action(getAllFTs)
  )
  .addCommand(
    program.command('history')
      .description('Get token transaction history')
      .requiredOption('--token-id <tokenId>', 'Token ID')
      .action(getFTChain)
  );

// NFT Operations
program
  .command('nft')
  .description('Non-Fungible Token operations')
  .addCommand(
    program.command('create')
      .description('Create new NFT')
      .requiredOption('--metadata <path>', 'Path to metadata file')
      .requiredOption('--artifact <path>', 'Path to artifact file')
      .action(createNFT)
  )
  .addCommand(
    program.command('deploy')
      .description('Deploy NFT')
      .requiredOption('--nft <nftId>', 'NFT ID')
      .requiredOption('--quorum-type <type>', 'Quorum type (1 or 2)')
      .action(deployNFT)
  )
  .addCommand(
    program.command('transfer')
      .description('Transfer NFT')
      .requiredOption('--to <did>', 'Receiver\'s DID')
      .requiredOption('--nft <nftId>', 'NFT ID')
      .requiredOption('--quorum-type <type>', 'Quorum type (1 or 2)')
      .option('--comment <text>', 'Transaction comment')
      .option('--data <data>', 'NFT data')
      .option('--value <amount>', 'NFT value')
      .action(executeNFT)
  )
  .addCommand(
    program.command('list')
      .description('List all NFTs')
      .action(getAllNFTs)
  )
  .addCommand(
    program.command('info')
      .description('Get NFT details')
      .requiredOption('--nft <nftId>', 'NFT ID')
      .action(getNFT)
  )
  .addCommand(
    program.command('history')
      .description('Get NFT transaction history')
      .requiredOption('--nft <nftId>', 'NFT ID')
      .option('--latest', 'Get only latest transaction')
      .action(getNFTChain)
  )
  .addCommand(
    program.command('subscribe')
      .description('Subscribe to NFT updates')
      .requiredOption('--nft <nftId>', 'NFT ID')
      .action(subscribeNFT)
  );

// Smart Contract Operations
program
  .command('contract')
  .description('Smart Contract operations')
  .addCommand(
    program.command('create')
      .description('Generate Smart Contract')
      .requiredOption('--binary <path>', 'Path to binary code file')
      .requiredOption('--raw <path>', 'Path to raw code file')
      .requiredOption('--schema <path>', 'Path to schema file')
      .action(generateSmartContract)
  )
  .addCommand(
    program.command('deploy')
      .description('Deploy Smart Contract')
      .requiredOption('--token <tokenId>', 'Smart Contract Token')
      .requiredOption('--quorum-type <type>', 'Quorum type (1 or 2)')
      .requiredOption('--amount <amount>', 'RBT amount')
      .option('--comment <text>', 'Deployment comment')
      .action(deploySmartContract)
  )
  .addCommand(
    program.command('execute')
      .description('Execute Smart Contract')
      .requiredOption('--token <tokenId>', 'Smart Contract Token')
      .requiredOption('--quorum-type <type>', 'Quorum type (1 or 2)')
      .option('--data <data>', 'Smart Contract data')
      .option('--comment <text>', 'Execution comment')
      .action(executeSmartContract)
  )
  .addCommand(
    program.command('subscribe')
      .description('Subscribe to Smart Contract updates')
      .requiredOption('--token <tokenId>', 'Smart Contract Token')
      .action(subscribeSmartContract)
  );

// Settings
program
  .command('settings')
  .description('Manage wallet settings')
  .option('--logout', 'Logout from wallet')
  .action((options) => {
    if (options.logout) {
      logout();
    } else {
      console.log('\nAvailable settings:');
      console.log('  --logout          Logout from wallet');
    }
  });

program.parse();