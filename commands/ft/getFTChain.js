import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders, getUserDID } from '../../utils/auth.js';

export default async function getFTChain(options) {
  try {
    const did = getUserDID();
    if (!did) {
      console.log(chalk.red('Not logged in. Please login first.'));
      return;
    }

    const spinner = ora('Fetching FT chain...').start();

    const response = await axios.get(`${config.baseURL}/get_ft_chain?did=${did}&tokenID=${options.tokenId}`, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nFT chain retrieved successfully!'));
      console.log(chalk.blue('Chain:'), JSON.stringify(response.data.result, null, 2));
    } else {
      console.log(chalk.red('Failed to get FT chain:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error getting FT chain:'), error.response?.data?.message || error.message);
  }
}