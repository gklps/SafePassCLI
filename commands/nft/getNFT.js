import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders } from '../../utils/auth.js';

export default async function getNFT(options) {
  try {
    const spinner = ora('Fetching NFT details...').start();

    const response = await axios.get(`${config.baseURL}/get_nft?did=${options.did}&nft=${options.nft}`, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nNFT details retrieved successfully!'));
      console.log(chalk.blue('NFT Details:'), JSON.stringify(response.data.result, null, 2));
    } else {
      console.log(chalk.red('Failed to get NFT details:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error getting NFT details:'), error.response?.data?.message || error.message);
  }
}