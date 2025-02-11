import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders, getUserDID } from '../../utils/auth.js';

export default async function transferFT(options) {
  try {
    const did = getUserDID();
    if (!did) {
      console.log(chalk.red('Not logged in. Please login first.'));
      return;
    }

    const spinner = ora('Transferring Fungible Tokens...').start();

    const response = await axios.post(`${config.baseURL}/transfer_ft`, {
      sender: did,
      receiver: options.to,
      ft_name: options.name,
      ft_count: parseInt(options.count),
      creatorDID: did,
      quorum_type: 2
    }, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nFungible Tokens transferred successfully!'));
      console.log(chalk.blue('Message:'), response.data.message);
    } else {
      console.log(chalk.red('Failed to transfer FT:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error transferring FT:'), error.response?.data?.message || error.message);
  }
}