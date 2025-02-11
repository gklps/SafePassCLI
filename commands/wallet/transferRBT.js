import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders, getUserDID } from '../../utils/auth.js';

export default async function transferRBT(options) {
  try {
    const did = getUserDID();
    if (!did) {
      console.log(chalk.red('Not logged in. Please login first.'));
      return;
    }

    const spinner = ora('Transferring RBT...').start();

    const response = await axios.post(`${config.baseURL}/request_txn`, {
      did: did,
      receiver: options.to,
      rbt_amount: parseFloat(options.amount)
    }, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nTransfer successful!'));
      console.log(chalk.blue('Message:'), response.data.message);
    } else {
      console.log(chalk.red('Transfer failed:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error transferring RBT:'), error.response?.data?.message || error.message);
  }
}