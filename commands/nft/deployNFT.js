import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders } from '../../utils/auth.js';

export default async function deployNFT(options) {
  try {
    const spinner = ora('Deploying NFT...').start();

    const response = await axios.post(`${config.baseURL}/deploy_nft`, {
      did: options.did,
      nft: options.nft,
      quorum_type: parseInt(options.quorumType)
    }, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nNFT deployed successfully!'));
      console.log(chalk.blue('Message:'), response.data.message);
    } else {
      console.log(chalk.red('Failed to deploy NFT:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error deploying NFT:'), error.response?.data?.message || error.message);
  }
}