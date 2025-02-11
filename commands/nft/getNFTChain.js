import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders } from '../../utils/auth.js';

export default async function getNFTChain(options) {
  try {
    const spinner = ora('Fetching NFT chain...').start();

    const url = new URL(`${config.baseURL}/get_nft_chain`);
    url.searchParams.append('did', options.did);
    url.searchParams.append('nft', options.nft);
    if (options.latest) {
      url.searchParams.append('latest', 'true');
    }

    const response = await axios.get(url.toString(), {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nNFT chain retrieved successfully!'));
      console.log(chalk.blue('Chain:'), JSON.stringify(response.data.result, null, 2));
    } else {
      console.log(chalk.red('Failed to get NFT chain:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error getting NFT chain:'), error.response?.data?.message || error.message);
  }
}