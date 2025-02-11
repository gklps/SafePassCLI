import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders, getUserDID } from '../../utils/auth.js';

export default async function getTransactionHistory() {
  try {
    const did = getUserDID();
    if (!did) {
      console.log(chalk.red('Not logged in. Please login first.'));
      return;
    }

    const spinner = ora('Fetching transaction history...').start();

    const response = await axios.get(`${config.baseURL}/get_transactions?did=${did}`, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nTransaction History:'));
      
      if (response.data.result.length === 0) {
        console.log(chalk.yellow('\nNo transactions found'));
        return;
      }

      response.data.result.forEach(tx => {
        console.log(chalk.blue('\nTransaction:'));
        console.log(chalk.white('Type:'), tx.type === 'send' ? 'Sent' : 'Received');
        console.log(chalk.white('Amount:'), tx.amount, 'RBT');
        console.log(chalk.white('Date:'), new Date(tx.timestamp).toLocaleString());
        console.log(chalk.white(tx.type === 'send' ? 'To:' : 'From:'), tx.type === 'send' ? tx.receiver : tx.sender);
      });
    } else {
      console.log(chalk.red('Failed to get transaction history:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error getting transaction history:'), error.response?.data?.message || error.message);
  }
}