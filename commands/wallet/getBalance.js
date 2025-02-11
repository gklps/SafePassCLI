import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders, getUserDID } from '../../utils/auth.js';

export default async function getBalance() {
  try {
    const did = getUserDID();
    if (!did) {
      console.log(chalk.red('Not logged in. Please login first.'));
      return;
    }

    const spinner = ora('Fetching balance...').start();

    const response = await axios.get(`${config.baseURL}/request_balance?did=${did}`, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nBalance retrieved successfully!'));
      response.data.result.forEach(account => {
        console.log(chalk.blue('\nAccount Information:'));
        console.log(chalk.white('DID:'), account.did);
        console.log(chalk.white('RBT Amount:'), account.rbt_amount);
        console.log(chalk.white('Locked RBT:'), account.locked_rbt);
        console.log(chalk.white('Pinned RBT:'), account.pinned_rbt);
        console.log(chalk.white('Pledged RBT:'), account.pledged_rbt);
      });
    } else {
      console.log(chalk.red('Failed to get balance:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error getting balance:'), error.response?.data?.message || error.message);
  }
}