import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders, getUserDID } from '../../utils/auth.js';

export default async function registerDID() {
  try {
    const did = getUserDID();
    if (!did) {
      console.log(chalk.red('Not logged in. Please login first.'));
      return;
    }

    const spinner = ora('Registering DID...').start();

    const response = await axios.post(`${config.baseURL}/register_did`, {
      did: did
    }, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nDID registered successfully!'));
      console.log(chalk.blue('Message:'), response.data.message);
    } else {
      console.log(chalk.red('Failed to register DID:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error registering DID:'), error.response?.data?.message || error.message);
  }
}