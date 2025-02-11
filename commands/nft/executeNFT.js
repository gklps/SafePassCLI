import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders } from '../../utils/auth.js';

export default async function executeNFT(options) {
  try {
    const spinner = ora('Executing NFT transaction...').start();

    const response = await axios.post(`${config.baseURL}/execute_nft`, {
      owner: options.owner,
      receiver: options.receiver,
      nft: options.nft,
      quorum_type: parseInt(options.quorumType),
      comment: options.comment,
      nft_data: options.data,
      nft_value: options.value ? parseFloat(options.value) : undefined
    }, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nNFT executed successfully!'));
      console.log(chalk.blue('Message:'), response.data.message);
    } else {
      console.log(chalk.red('Failed to execute NFT:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error executing NFT:'), error.response?.data?.message || error.message);
  }
}