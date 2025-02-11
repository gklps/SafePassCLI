import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders } from '../../utils/auth.js';

export default async function getAllNFTs(options) {
  try {
    const spinner = ora('Fetching all NFTs...').start();

    const response = await axios.get(`${config.baseURL}/get_all_nft?did=${options.did}`, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nNFTs retrieved successfully!'));
      response.data.result.forEach(nft => {
        console.log(chalk.blue('\nNFT Information:'));
        console.log(chalk.white('NFT ID:'), nft.nft);
        console.log(chalk.white('NFT Value:'), nft.nft_value);
        console.log(chalk.white('Owner DID:'), nft.owner_did);
      });
    } else {
      console.log(chalk.red('Failed to get NFTs:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error getting NFTs:'), error.response?.data?.message || error.message);
  }
}