import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders, getUserDID } from '../../utils/auth.js';

export default async function setupQuorum() {
  try {
    const did = getUserDID();
    if (!did) {
      console.log(chalk.red('Not logged in. Please login first.'));
      return;
    }

    const spinner = ora('Setting up quorum...').start();

    const response = await axios.post(`${config.baseURL}/setup_quorum`, {
      did: did
    }, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nQuorum setup successful!'));
      console.log(chalk.blue('Message:'), response.data.message);
    } else {
      console.log(chalk.red('Failed to setup quorum:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error setting up quorum:'), error.response?.data?.message || error.message);
  }
}