import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders, getUserDID } from '../../utils/auth.js';

export default async function createFT(options) {
  try {
    const did = getUserDID();
    if (!did) {
      console.log(chalk.red('Not logged in. Please login first.'));
      return;
    }

    const spinner = ora('Creating Fungible Tokens...').start();

    const response = await axios.post(`${config.baseURL}/create_ft`, {
      did: did,
      ft_name: options.name,
      ft_count: parseInt(options.count),
      token_count: parseInt(options.tokens)
    }, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nFungible Tokens created successfully!'));
      console.log(chalk.blue('Message:'), response.data.message);
    } else {
      console.log(chalk.red('Failed to create FT:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error creating FT:'), error.response?.data?.message || error.message);
  }
}