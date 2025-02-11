import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders } from '../../utils/auth.js';

export default async function subscribeNFT(options) {
  try {
    const spinner = ora('Subscribing to NFT...').start();

    const response = await axios.post(`${config.baseURL}/subscribe_nft`, {
      did: options.did,
      nft: options.nft
    }, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nSubscribed to NFT successfully!'));
      console.log(chalk.blue('Message:'), response.data.message);
    } else {
      console.log(chalk.red('Failed to subscribe to NFT:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error subscribing to NFT:'), error.response?.data?.message || error.message);
  }
}